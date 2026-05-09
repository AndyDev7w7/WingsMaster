import Usuario from '../models/Usuario.js'
import generateToken from '../utils/generateToken.js'

const normalizarRole = (role = 'cliente') => {
  const mapRoles = {
    player: 'cliente',
    admin: 'administrador',
  }

  return mapRoles[role] || role
}

export const registrarUsuario = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const userExiste = await Usuario.findOne({ email })
    if (userExiste) {
      return res.status(400).json({ msg: 'Ese email ya esta registrado' })
    }

    const user = await Usuario.create({ username, email, password })
    // console.log('nuevo user:', user.email)

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: normalizarRole(user.role),
      token: generateToken(user),
    })
  } catch (err) {
    // console.log('registro fail', err)
    res.status(500).json({ msg: 'No se pudo registrar el user', error: err.message })
  }
}

export const autenticarUsuario = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Usuario.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: normalizarRole(user.role),
        token: generateToken(user),
      })
    }

    res.status(401).json({ msg: 'Credenciales invalidas' })
  } catch (err) {
    // console.log('login fail', err)
    res.status(500).json({ msg: 'No se pudo iniciar sesion', error: err.message })
  }
}
