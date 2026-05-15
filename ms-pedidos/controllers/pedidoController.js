import Pedido from '../models/Pedido.js'

const authHeaders = (req) => {
  const token = req.headers.authorization
  return token ? { Authorization: token } : {}
}

const avisarInventario = async (insumos = []) => {
  if (!insumos.length || !process.env.MS_INVENTARIO_URL) return

  try {
    await fetch(`${process.env.MS_INVENTARIO_URL}/api/inventario/descontar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': process.env.INTERNAL_SERVICE_KEY || '',
      },
      body: JSON.stringify({ items: insumos }),
    })
  } catch (err) {
    // console.log('inventario no contesto', err.message)
  }
}

const traerCarrito = async (usuarioId, req) => {
  if (!process.env.MS_PRODUCTOS_URL) return null

  const resp = await fetch(`${process.env.MS_PRODUCTOS_URL}/api/carrito/${usuarioId}`, {
    headers: authHeaders(req),
  })

  if (!resp.ok) return null
  return resp.json()
}

const vaciarCarrito = async (usuarioId, req) => {
  if (!process.env.MS_PRODUCTOS_URL) return

  try {
    await fetch(`${process.env.MS_PRODUCTOS_URL}/api/carrito/${usuarioId}`, {
      method: 'DELETE',
      headers: authHeaders(req),
    })
  } catch (err) {
    // console.log('no se pudo vaciar carrito', err.message)
  }
}

const mapItemsCarrito = (items = []) =>
  items.map((item) => {
    const prod = item.productoId

    return {
      productoId: prod?._id || prod,
      nombre: prod?.nombre || item.nombre,
      cantidad: item.cantidad,
      precioUnitario: prod?.precio || item.precioUnitario || 0,
    }
  })

const insumosDefault = (productos = []) => {
  const unidades = productos.reduce((acc, prod) => acc + Number(prod.cantidad || 0), 0)

  return [
    { itemNombre: 'Alitas', cantidad: Math.max(unidades * 6, 1) },
    { itemNombre: 'Salsas', cantidad: Math.max(unidades, 1) },
    { itemNombre: 'Empaques', cantidad: 1 },
  ]
}

export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 })
    res.json(pedidos)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudieron traer pedidos', error: err.message })
  }
}

export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' })
    }

    if (req.user.role === 'cliente' && pedido.usuarioId !== req.user.id) {
      return res.status(403).json({ msg: 'Ese pedido no es tuyo' })
    }

    res.json(pedido)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo traer el pedido', error: err.message })
  }
}

export const crearPedido = async (req, res) => {
  try {
    const {
      usuarioId,
      cliente,
      productos = [],
      total,
      direccionEnvio,
      metodoPago,
      tipo = 'Domicilio',
      insumos = [],
    } = req.body
    const userIdFinal = req.user.role === 'cliente' ? req.user.id : usuarioId
    let prodsFinal = productos
    let totalFinal = total
    let pedidoDesdeCarrito = false

    if (!prodsFinal.length) {
      const carrito = await traerCarrito(userIdFinal, req)
      prodsFinal = mapItemsCarrito(carrito?.items)
      totalFinal = carrito?.total
      pedidoDesdeCarrito = prodsFinal.length > 0
    }

    if (!userIdFinal || !prodsFinal.length || totalFinal == null || !direccionEnvio) {
      return res.status(400).json({ msg: 'Faltan datos para crear el pedido' })
    }

    const pedido = await Pedido.create({
      usuarioId: userIdFinal,
      cliente: cliente || req.user.username || 'Cliente Krunchy',
      tipo,
      productos: prodsFinal,
      total: totalFinal,
      direccionEnvio,
      metodoPago,
    })
    await avisarInventario(insumos.length ? insumos : insumosDefault(prodsFinal))
    if (pedidoDesdeCarrito) await vaciarCarrito(userIdFinal, req)

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
      { returnDocument: 'after', runValidators: true },
    )

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' })
    }

    res.json(pedido)
  } catch (err) {
    res.status(400).json({ msg: 'No se pudo actualizar el estado', error: err.message })
  }
}

export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: 'Cancelado' },
      { returnDocument: 'after' },
    )

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' })
    }

    res.json({ msg: 'Pedido cancelado', pedido })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo cancelar pedido', error: err.message })
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
