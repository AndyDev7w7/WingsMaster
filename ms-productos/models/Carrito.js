import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
)

const carritoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: [itemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

const Carrito = mongoose.model('Carrito', carritoSchema)

export default Carrito
