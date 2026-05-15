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
    cliente: {
      type: String,
      trim: true,
      default: 'Cliente Krunchy',
    },
    tipo: {
      type: String,
      enum: ['Domicilio', 'Local'],
      default: 'Domicilio',
    },
    productos: [prodPedidoSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Preparando', 'Listo', 'Recogido', 'En camino', 'Entregado', 'Cancelado'],
      default: 'Pendiente',
    },
    direccionEnvio: {
      type: String,
      required: true,
      trim: true,
    },
    metodoPago: {
      type: String,
      trim: true,
      default: 'Pago en efectivo',
    },
    pagado: {
      type: Boolean,
      default: false,
    },
    repartidor: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
)

const Pedido = mongoose.model('Pedido', pedidoSchema)

export default Pedido
