import Factura from '../models/Factura.js'

export const procesarPago = async (req, res) => {
  try {
    const { pedidoId, monto, metodoPago } = req.body

    if (!pedidoId || monto == null || !metodoPago) {
      return res.status(400).json({ msg: 'Faltan datos del pago' })
    }

    const pago = {
      pedidoId,
      monto,
      metodoPago,
      estado: 'Aprobado',
      refPago: `WM-${Date.now()}`,
    }

    res.json({ msg: 'Pago procesado', pago })
  } catch (err) {
    // console.log('pago fail', err)
    res.status(500).json({ msg: 'No se pudo procesar el pago', error: err.message })
  }
}

export const generarFactura = async (req, res) => {
  try {
    const { pedidoId, monto, metodoPago, fecha } = req.body

    if (!pedidoId || monto == null || !metodoPago) {
      return res.status(400).json({ msg: 'Faltan datos para facturar' })
    }

    const factura = await Factura.create({ pedidoId, monto, metodoPago, fecha })
    res.status(201).json(factura)
  } catch (err) {
    // console.log('factura fail', err)
    res.status(500).json({ msg: 'No se pudo generar factura', error: err.message })
  }
}

export const obtenerHistorial = async (req, res) => {
  try {
    const filtro = req.query.pedidoId ? { pedidoId: req.query.pedidoId } : {}
    const facturas = await Factura.find(filtro).sort({ fecha: -1 })

    res.json(facturas)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo traer historial', error: err.message })
  }
}
