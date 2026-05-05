import mongoose from 'mongoose'

const pedidoRptSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true, collection: 'pedidos' },
)

const PedidoRpt = mongoose.model('PedidoRpt', pedidoRptSchema)

export default PedidoRpt
