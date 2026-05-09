import jwt from 'jsonwebtoken'

const normalizarRole = (role = 'cliente') => {
  const mapRoles = {
    player: 'cliente',
    admin: 'administrador',
  }

  return mapRoles[role] || role
}

const generateToken = (usr) => {
  const payload = {
    id: usr._id || usr.id || usr,
  }

  if (usr.role) payload.role = normalizarRole(usr.role)
  if (usr.username) payload.username = usr.username

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export default generateToken
