import mongoose from 'mongoose'

const facturaSchema = new mongoose.Schema(
  {
    pedidoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
      required: true,
    },
    monto: {
      type: Number,
      required: true,
      min: 0,
    },
    metodoPago: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const Factura = mongoose.model('Factura', facturaSchema)

export default Factura
