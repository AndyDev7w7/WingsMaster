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
    const { username, email, password, nombre, telefono, direccion, role } = req.body

    const userExiste = await Usuario.findOne({ email })
    if (userExiste) {
      return res.status(400).json({ msg: 'Ese email ya esta registrado' })
    }

    const user = await Usuario.create({
      username,
      email,
      password,
      nombre: nombre || username,
      telefono,
      direccion,
      role: req.user?.role === 'administrador' ? role || 'cliente' : 'cliente',
    })
    // console.log('nuevo user:', user.email)

    res.status(201).json({
      _id: user._id,
      username: user.username,
      nombre: user.nombre || user.username,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      estado: user.estado,
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

    if (user?.estado === 'Inactivo') {
      return res.status(403).json({ msg: 'Usuario inactivo' })
    }

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        nombre: user.nombre || user.username,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
        estado: user.estado,
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

export const obtenerUsuarios = async (req, res) => {
  try {
    const users = await Usuario.find().select('-password').sort({ createdAt: -1 })
    res.json(users.map((usr) => ({ ...usr.toObject(), role: normalizarRole(usr.role) })))
  } catch (err) {
    res.status(500).json({ msg: 'No se pudieron traer usuarios', error: err.message })
  }
}

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, username, telefono, direccion, email } = req.body
    const usr = await Usuario.findByIdAndUpdate(
      req.user._id,
      { nombre, username, telefono, direccion, email },
      { returnDocument: 'after', runValidators: true },
    ).select('-password')

    res.json({ ...usr.toObject(), role: normalizarRole(usr.role) })
  } catch (err) {
    res.status(400).json({ msg: 'No se pudo actualizar perfil', error: err.message })
  }
}

export const actualizarUsuario = async (req, res) => {
  try {
    const data = { ...req.body }
    delete data.password

    const usr = await Usuario.findByIdAndUpdate(req.params.id, data, {
      returnDocument: 'after',
      runValidators: true,
    }).select('-password')

    if (!usr) return res.status(404).json({ msg: 'Usuario no encontrado' })

    res.json({ ...usr.toObject(), role: normalizarRole(usr.role) })
  } catch (err) {
    res.status(400).json({ msg: 'No se pudo actualizar usuario', error: err.message })
  }
}

export const desactivarUsuario = async (req, res) => {
  try {
    const usr = await Usuario.findByIdAndUpdate(
      req.params.id,
      { estado: 'Inactivo' },
      { returnDocument: 'after' },
    ).select('-password')

    if (!usr) return res.status(404).json({ msg: 'Usuario no encontrado' })

    res.json({ msg: 'Usuario desactivado', usuario: usr })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo desactivar usuario', error: err.message })
  }
}
