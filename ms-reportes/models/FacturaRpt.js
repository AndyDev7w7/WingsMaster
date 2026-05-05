import mongoose from 'mongoose'

const facturaRptSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true, collection: 'facturas' },
)

const FacturaRpt = mongoose.model('FacturaRpt', facturaRptSchema)

export default FacturaRpt
