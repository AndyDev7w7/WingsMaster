import FacturaRpt from '../models/FacturaRpt.js'
import PedidoRpt from '../models/PedidoRpt.js'

const contarPorEstado = (items = []) => {
  const base = {
    Pendiente: 0,
    Preparando: 0,
    Listo: 0,
    Recogido: 0,
    'En camino': 0,
    Entregado: 0,
    Cancelado: 0,
  }

  for (const item of items) {
    base[item._id] = item.total
  }

  return base
}

export const obtenerDashboard = async (req, res) => {
  try {
    const [
      ventasData,
      estadosData,
      ventasPorDia,
      productosTop,
      pagosMetodo,
      pedidosRecientes,
      totalPedidos,
    ] = await Promise.all([
      FacturaRpt.aggregate([
        { $match: { estado: { $ne: 'Anulado' } } },
        {
          $group: {
            _id: null,
            ventasTotales: { $sum: '$monto' },
            totalFacturas: { $sum: 1 },
          },
        },
      ]),
      PedidoRpt.aggregate([
        {
          $group: {
            _id: '$estado',
            total: { $sum: 1 },
          },
        },
      ]),
      FacturaRpt.aggregate([
        { $match: { estado: { $ne: 'Anulado' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
            ventas: { $sum: '$monto' },
            facturas: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 7 },
        { $sort: { _id: 1 } },
      ]),
      PedidoRpt.aggregate([
        { $unwind: '$productos' },
        { $match: { 'productos.nombre': { $type: 'string', $ne: '' } } },
        {
          $group: {
            _id: '$productos.nombre',
            nombre: { $first: '$productos.nombre' },
            unidades: { $sum: '$productos.cantidad' },
            ventas: {
              $sum: {
                $multiply: ['$productos.cantidad', '$productos.precioUnitario'],
              },
            },
          },
        },
        { $sort: { unidades: -1 } },
        { $limit: 4 },
      ]),
      FacturaRpt.aggregate([
        { $match: { estado: { $ne: 'Anulado' } } },
        {
          $group: {
            _id: '$metodoPago',
            total: { $sum: 1 },
            ventas: { $sum: '$monto' },
          },
        },
        { $sort: { total: -1 } },
      ]),
      PedidoRpt.find().sort({ createdAt: -1 }).limit(5).lean(),
      PedidoRpt.countDocuments(),
    ])

    const ventas = ventasData[0] || { ventasTotales: 0, totalFacturas: 0 }
    const porEstado = contarPorEstado(estadosData)

    res.json({
      kpis: {
        pedidosTotales: totalPedidos,
        ventasTotales: ventas.ventasTotales,
        totalFacturas: ventas.totalFacturas,
        pedidosEntregados: porEstado.Entregado,
        pedidosPendientes: porEstado.Pendiente,
      },
      porEstado,
      ventasPorDia,
      productosTop,
      pagosMetodo,
      pedidosRecientes,
    })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo armar el dashboard', error: err.message })
  }
}

export const obtenerVentasTotales = async (req, res) => {
  try {
    const data = await FacturaRpt.aggregate([
      { $match: { estado: { $ne: 'Anulado' } } },
      {
        $group: {
          _id: null,
          ventasTotales: { $sum: '$monto' },
          totalFacturas: { $sum: 1 },
        },
      },
    ])

    res.json(data[0] || { ventasTotales: 0, totalFacturas: 0 })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudieron calcular ventas', error: err.message })
  }
}

export const productoMasVendido = async (req, res) => {
  try {
    const data = await PedidoRpt.aggregate([
      { $unwind: '$productos' },
      { $match: { 'productos.nombre': { $type: 'string', $ne: '' } } },
      {
        $group: {
          _id: '$productos.productoId',
          nombre: { $first: '$productos.nombre' },
          unidades: { $sum: '$productos.cantidad' },
        },
      },
      { $sort: { unidades: -1 } },
      { $limit: 1 },
    ])

    res.json(data[0] || { msg: 'Sin ventas registradas' })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo calcular producto top', error: err.message })
  }
}

export const metricasMensuales = async (req, res) => {
  try {
    const data = await FacturaRpt.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$fecha' },
            mes: { $month: '$fecha' },
          },
          ventas: { $sum: '$monto' },
          facturas: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.mes': 1 } },
    ])

    res.json(data)
  } catch (err) {
    // console.log('metricas fail', err)
    res.status(500).json({ msg: 'No se pudieron calcular metricas', error: err.message })
  }
}
