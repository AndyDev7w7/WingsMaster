import Pedido from '../models/Pedido.js'

const avisarInventario = async (insumos = []) => {
  if (!insumos.length || !process.env.MS_INVENTARIO_URL) return

  try {
    await fetch(`${process.env.MS_INVENTARIO_URL}/api/inventario/descontar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: insumos }),
    })
  } catch (err) {
    // console.log('inventario no contesto', err.message)
  }
}

export const crearPedido = async (req, res) => {
  try {
    const { usuarioId, productos = [], total, direccionEnvio, insumos = [] } = req.body

    if (!usuarioId || !productos.length || total == null || !direccionEnvio) {
      return res.status(400).json({ msg: 'Faltan datos para crear el pedido' })
    }

    const pedido = await Pedido.create({ usuarioId, productos, total, direccionEnvio })
    await avisarInventario(insumos)

    res.status(201).json(pedido)
  } catch (err) {
    // console.log('pedido fail', err)
    res.status(500).json({ msg: 'No se pudo crear el pedido', error: err.message })
  }
}

export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true },
    )

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' })
    }

    res.json(pedido)
  } catch (err) {
    res.status(400).json({ msg: 'No se pudo actualizar el estado', error: err.message })
  }
}

export const obtenerMisPedidos = async (req, res) => {
  try {
    const { usuarioId } = req.params
    const pedidos = await Pedido.find({ usuarioId }).sort({ createdAt: -1 })

    res.json(pedidos)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudieron traer los pedidos', error: err.message })
  }
}
