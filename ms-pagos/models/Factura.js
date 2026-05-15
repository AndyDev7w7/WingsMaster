import mongoose from 'mongoose'

const facturaSchema = new mongoose.Schema(
  {
    pedidoId: {
      type: String,
      required: true,
      trim: true,
    },
    usuarioId: {
      type: String,
      trim: true,
      default: '',
    },
    cliente: {
      type: String,
      trim: true,
      default: 'Cliente Krunchy',
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
    estado: {
      type: String,
      enum: ['Pendiente', 'Completado', 'Anulado'],
      default: 'Completado',
    },
    refPago: {
      type: String,
      trim: true,
      default: '',
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
