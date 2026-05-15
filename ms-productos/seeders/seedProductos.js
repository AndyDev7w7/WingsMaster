import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Producto from '../models/Producto.js'

dotenv.config()

const prodsSeed = [
  {
    nombre: 'Combo Clásico',
    aliases: ['Combo Clasico'],
    descripcion: '6 alitas BBQ, papas crocantes y bebida personal.',
    precio: 21900,
    imagen: '/productos/combo-clasico-real.png',
    categoria: 'Combos',
    disponible: true,
  },
  {
    nombre: 'Alitas BBQ',
    descripcion: '8 unidades bañadas en salsa BBQ de la casa.',
    precio: 18000,
    imagen: '/productos/alitas-bbq-real.png',
    categoria: 'Alitas',
    disponible: true,
  },
  {
    nombre: 'Combo para Dos',
    descripcion: '12 alitas, papas, dos salsas y dos bebidas.',
    precio: 37900,
    imagen: '/productos/combo-dos-real.png',
    categoria: 'Combos',
    disponible: true,
  },
  {
    nombre: 'Combo Fiesta',
    descripcion: '24 alitas mixtas, papas familiares, salsas y gaseosa.',
    precio: 57900,
    imagen: '/productos/combo-fiesta-real.png',
    categoria: 'Combos',
    disponible: true,
  },
  {
    nombre: 'Combo Familiar',
    descripcion: '36 alitas, acompañantes y bebida familiar.',
    precio: 72900,
    imagen: '/productos/combo-familiar-real.png',
    categoria: 'Combos',
    disponible: true,
  },
  {
    nombre: 'Papas Criollas',
    descripcion: 'Porción de papas criollas crocantes.',
    precio: 9000,
    imagen: '/productos/papas-criollas-real.png',
    categoria: 'Acompañantes',
    disponible: true,
  },
  {
    nombre: 'Limonada Natural',
    descripcion: 'Bebida fría de limón natural.',
    precio: 6000,
    imagen: '/productos/limonada-natural-real.png',
    categoria: 'Bebidas',
    disponible: true,
  },
  {
    nombre: 'Salsa Miel Mostaza',
    descripcion: 'Salsa extra dulce y suave.',
    precio: 2500,
    imagen: '/productos/salsa-miel-mostaza-real.png',
    categoria: 'Salsas',
    disponible: true,
  },
  {
    nombre: 'Combo Krunchy Duo',
    descripcion: 'Doce alitas, papas y dos bebidas.',
    precio: 42000,
    imagen: '/productos/combo-krunchy-duo-real.png',
    categoria: 'Combos',
    disponible: true,
  },
  {
    nombre: 'Alitas BBQ x6',
    descripcion: 'Seis alitas bañadas en salsa BBQ de la casa.',
    precio: 18000,
    imagen: '/productos/alitas-bbq-x6-real.png',
    categoria: 'Alitas',
    disponible: true,
  },
]

const fallbackImg = (prod) => {
  const nombre = prod.nombre.toLowerCase()
  if (nombre.includes('x6')) return '/productos/alitas-bbq-x6-real.png'
  if (nombre.includes('bbq') || nombre.includes('alita')) return '/productos/alitas-bbq-real.png'
  if (nombre.includes('papa')) return '/productos/papas-criollas-real.png'
  if (nombre.includes('limon') || nombre.includes('sprite') || nombre.includes('pepsi')) return '/productos/limonada-natural-real.png'
  if (nombre.includes('salsa')) return '/productos/salsa-miel-mostaza-real.png'
  if (nombre.includes('duo')) return '/productos/combo-krunchy-duo-real.png'
  if (nombre.includes('fiesta')) return '/productos/combo-fiesta-real.png'
  if (nombre.includes('familiar')) return '/productos/combo-familiar-real.png'
  if (nombre.includes('dos')) return '/productos/combo-dos-real.png'
  return '/productos/combo-clasico-real.png'
}

const seedProductos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    for (const prod of prodsSeed) {
      const { aliases = [], ...dataProd } = prod
      await Producto.findOneAndUpdate({ nombre: { $in: [dataProd.nombre, ...aliases] } }, dataProd, {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      })
    }

    const actuales = await Producto.find()
    for (const prod of actuales) {
      if (!prod.imagen || prod.imagen.includes('krunchy.local')) {
        prod.imagen = fallbackImg(prod)
        await prod.save()
      }
    }

    console.log('Seed productos ok')
    await mongoose.disconnect()
  } catch (err) {
    console.error('Seed productos fail:', err.message)
    process.exit(1)
  }
}

seedProductos()
