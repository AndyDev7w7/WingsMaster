import Usuario from '../models/Usuario.js'

export const listarUsers = async (req, res) => {
  try {
    const listaUsers = await Usuario.find().select('-password').sort({ createdAt: -1 })
    res.json(listaUsers)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudieron traer los users', error: err.message })
  }
}

export const crearUsr = async (req, res) => {
  try {
    const dataUsr = req.body
    // console.log('data usr:', dataUsr)

    const existeUsr = await Usuario.findOne({ email: dataUsr.email })
    if (existeUsr) {
      return res.status(409).json({ msg: 'Ese email ya esta registrado' })
    }

    const nuevoUsr = await Usuario.create(dataUsr)
    const usrLimpio = nuevoUsr.toObject()
    delete usrLimpio.password

    res.status(201).json(usrLimpio)
  } catch (err) {
    // console.log('error creando usr', err)
    res.status(400).json({ msg: 'No se pudo crear el user', error: err.message })
  }
}

export const pingUsuarios = (req, res) => {
  res.json({ ok: true, ms: 'usuarios' })
}
