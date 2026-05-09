import jwt from 'jsonwebtoken'

const normalizarRole = (role = 'cliente') => {
  const mapRoles = {
    player: 'cliente',
    admin: 'administrador',
  }

  return mapRoles[role] || role
}

export const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization

    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No autorizado, falta token' })
    }

    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: normalizarRole(decoded.role),
    }

    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token invalido' })
  }
}

export const authorizeRoles = (...rolesOk) => {
  return (req, res, next) => {
    if (rolesOk.includes(req.user?.role)) {
      return next()
    }

    res.status(403).json({ msg: 'No tienes permiso para esta accion' })
  }
}

export const internalOrRoles = (...rolesOk) => {
  return (req, res, next) => {
    const svcKey = req.headers['x-service-key']

    if (process.env.INTERNAL_SERVICE_KEY && svcKey === process.env.INTERNAL_SERVICE_KEY) {
      return next()
    }

    return protect(req, res, () => authorizeRoles(...rolesOk)(req, res, next))
  }
}
