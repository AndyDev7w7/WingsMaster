import mongoose from 'mongoose'

const inventarioSchema = new mongoose.Schema(
  {
    itemNombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ['Alitas', 'Salsas', 'Empaques'],
    },
    stockActual: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    stockMinimo: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unidadMedida: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

const Inventario = mongoose.model('Inventario', inventarioSchema)

export default Inventario
