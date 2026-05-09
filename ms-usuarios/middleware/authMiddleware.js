import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const normalizarRole = (role = 'cliente') => {
  const mapRoles = {
    player: 'cliente',
    admin: 'administrador',
  }

  return mapRoles[role] || role
}

export const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await Usuario.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ msg: 'No autorizado' })
      }

      req.user.role = normalizarRole(req.user.role)

      return next()
    } catch (err) {
      return res.status(401).json({ msg: 'Token invalido' })
    }
  }

  res.status(401).json({ msg: 'No autorizado, falta token' })
}

export const authorizeRoles = (...rolesOk) => {
  return (req, res, next) => {
    if (rolesOk.includes(req.user?.role)) {
      return next()
    }

    res.status(403).json({ msg: 'No tienes permiso para esta accion' })
  }
}
