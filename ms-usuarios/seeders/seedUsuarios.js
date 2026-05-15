import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Usuario from '../models/Usuario.js'

dotenv.config()

const usersSeed = [
  {
    username: 'admin_krunchy',
    nombre: 'Carlos Perez',
    email: 'admin@krunchy.local',
    password: 'Wings12345',
    role: 'administrador',
  },
  {
    username: 'empleado_caja',
    nombre: 'Roberto Vargas',
    email: 'empleado@krunchy.local',
    password: 'Wings12345',
    role: 'empleado',
  },
  {
    username: 'repartidor_krunchy',
    nombre: 'Carla Rodriguez',
    email: 'repartidor@krunchy.local',
    password: 'Wings12345',
    role: 'repartidor',
  },
  {
    username: 'cliente_demo',
    nombre: 'Laura Gomez',
    email: 'cliente@krunchy.local',
    password: 'Wings12345',
    role: 'cliente',
  },
]

const seedUsuarios = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    for (const dataUsr of usersSeed) {
      const usr = await Usuario.findOne({ email: dataUsr.email })

      if (usr) {
        usr.username = dataUsr.username
        usr.password = dataUsr.password
        usr.role = dataUsr.role
        await usr.save()
        continue
      }

      await Usuario.create(dataUsr)
    }

    console.log('Seed usuarios ok')
    await mongoose.disconnect()
  } catch (err) {
    console.error('Seed usuarios fail:', err.message)
    process.exit(1)
  }
}

seedUsuarios()
