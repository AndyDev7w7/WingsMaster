import mongoose from 'mongoose'

const prodSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    imagen: {
      type: String,
    },
    categoria: {
      type: String,
      enum: ['Alitas', 'Combos', 'Acompañantes', 'Bebidas', 'Salsas'],
    },
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

const Producto = mongoose.model('Producto', prodSchema)

export default Producto
