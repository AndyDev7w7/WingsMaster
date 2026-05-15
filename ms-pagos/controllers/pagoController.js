import Factura from '../models/Factura.js'

export const procesarPago = async (req, res) => {
  try {
    const { pedidoId, monto, metodoPago, cliente, usuarioId } = req.body

    if (!pedidoId || monto == null || !metodoPago) {
      return res.status(400).json({ msg: 'Faltan datos del pago' })
    }

    const pago = await Factura.create({
      pedidoId,
      usuarioId: usuarioId || req.user.id || '',
      cliente: cliente || req.user.username || 'Cliente Krunchy',
      monto,
      metodoPago,
      refPago: `WM-${Date.now()}`,
      estado: 'Completado',
    })

    res.json({ msg: 'Pago procesado', pago })
  } catch (err) {
    // console.log('pago fail', err)
    res.status(500).json({ msg: 'No se pudo procesar el pago', error: err.message })
  }
}

export const generarFactura = async (req, res) => {
  try {
    const { pedidoId, monto, metodoPago, fecha, cliente, usuarioId, estado = 'Completado' } = req.body

    if (!pedidoId || monto == null || !metodoPago) {
      return res.status(400).json({ msg: 'Faltan datos para facturar' })
    }

    const factura = await Factura.create({
      pedidoId,
      usuarioId: usuarioId || req.user.id || '',
      cliente: cliente || req.user.username || 'Cliente Krunchy',
      monto,
      metodoPago,
      fecha,
      estado,
      refPago: `FAC-${Date.now()}`,
    })
    res.status(201).json(factura)
  } catch (err) {
    // console.log('factura fail', err)
    res.status(500).json({ msg: 'No se pudo generar factura', error: err.message })
  }
}

export const actualizarPago = async (req, res) => {
  try {
    const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    })

    if (!factura) return res.status(404).json({ msg: 'Pago no encontrado' })

    res.json(factura)
  } catch (err) {
    res.status(400).json({ msg: 'No se pudo actualizar pago', error: err.message })
  }
}

export const anularPago = async (req, res) => {
  try {
    const factura = await Factura.findByIdAndUpdate(
      req.params.id,
      { estado: 'Anulado' },
      { returnDocument: 'after' },
    )

    if (!factura) return res.status(404).json({ msg: 'Pago no encontrado' })

    res.json({ msg: 'Pago anulado', factura })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo anular pago', error: err.message })
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
