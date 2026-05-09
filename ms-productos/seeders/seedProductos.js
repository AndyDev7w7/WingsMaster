import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Producto from '../models/Producto.js'

dotenv.config()

const prodsSeed = [
  {
    nombre: 'Alitas BBQ x6',
    descripcion: 'Seis alitas bañadas en salsa BBQ de la casa.',
    precio: 18000,
    imagen: 'https://krunchy.local/img/alitas-bbq-x6.png',
    categoria: 'Alitas',
    disponible: true,
  },
  {
    nombre: 'Combo Krunchy Duo',
    descripcion: 'Doce alitas, papas y dos bebidas.',
    precio: 42000,
    imagen: 'https://krunchy.local/img/combo-duo.png',
    categoria: 'Combos',
    disponible: true,
  },
  {
    nombre: 'Papas Criollas',
    descripcion: 'Porcion de papas criollas crocantes.',
    precio: 9000,
    imagen: 'https://krunchy.local/img/papas-criollas.png',
    categoria: 'Acompañantes',
    disponible: true,
  },
  {
    nombre: 'Limonada Natural',
    descripcion: 'Bebida fria de limon natural.',
    precio: 6000,
    imagen: 'https://krunchy.local/img/limonada.png',
    categoria: 'Bebidas',
    disponible: true,
  },
  {
    nombre: 'Salsa Miel Mostaza',
    descripcion: 'Salsa extra dulce y suave.',
    precio: 2500,
    imagen: 'https://krunchy.local/img/miel-mostaza.png',
    categoria: 'Salsas',
    disponible: true,
  },
]

const seedProductos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    for (const prod of prodsSeed) {
      await Producto.findOneAndUpdate({ nombre: prod.nombre }, prod, {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      })
    }

    console.log('Seed productos ok')
    await mongoose.disconnect()
  } catch (err) {
    console.error('Seed productos fail:', err.message)
    process.exit(1)
  }
}

seedProductos()
