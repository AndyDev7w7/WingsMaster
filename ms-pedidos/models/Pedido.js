import mongoose from 'mongoose'

const prodPedidoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    nombre: {
      type: String,
      trim: true,
    },
    cantidad: {
      type: Number,
      min: 1,
      default: 1,
    },
    precioUnitario: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
)

const pedidoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: String,
      required: true,
      trim: true,
    },
    productos: [prodPedidoSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Preparando', 'En camino', 'Entregado'],
      default: 'Pendiente',
    },
    direccionEnvio: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

const Pedido = mongoose.model('Pedido', pedidoSchema)

export default Pedido
