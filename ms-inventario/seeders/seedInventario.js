import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Inventario from '../models/Inventario.js'

dotenv.config()

const inventarioSeed = [
  {
    itemNombre: 'Alitas',
    stockActual: 200,
    stockMinimo: 40,
    unidadMedida: 'unidades',
  },
  {
    itemNombre: 'Salsas',
    stockActual: 80,
    stockMinimo: 20,
    unidadMedida: 'porciones',
  },
  {
    itemNombre: 'Empaques',
    stockActual: 120,
    stockMinimo: 30,
    unidadMedida: 'unidades',
  },
]

const seedInventario = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    for (const item of inventarioSeed) {
      await Inventario.findOneAndUpdate({ itemNombre: item.itemNombre }, item, {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      })
    }

    console.log('Seed inventario ok')
    await mongoose.disconnect()
  } catch (err) {
    console.error('Seed inventario fail:', err.message)
    process.exit(1)
  }
}

seedInventario()
