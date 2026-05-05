import jwt from 'jsonwebtoken'

export const staffOnly = (req, res, next) => {
  const headerRole = req.headers['x-user-role']
  let role = headerRole

  try {
    const auth = req.headers.authorization
    if (auth?.startsWith('Bearer ')) {
      const token = auth.split(' ')[1]
      role = jwt.verify(token, process.env.JWT_SECRET).role || role
    }
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalido' })
  }

  if (['admin', 'empleado'].includes(String(role).toLowerCase())) {
    return next()
  }

  res.status(403).json({ msg: 'Solo admin o empleado' })
}
