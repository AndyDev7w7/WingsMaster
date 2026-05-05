import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await Usuario.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ msg: 'No autorizado' })
      }

      return next()
    } catch (err) {
      return res.status(401).json({ msg: 'Token invalido' })
    }
  }

  res.status(401).json({ msg: 'No autorizado, falta token' })
}
