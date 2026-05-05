import Carrito from '../models/Carrito.js'
import Producto from '../models/Producto.js'

const idTxt = (id) => id?._id?.toString() || id?.toString()

const recalcularTotal = async (items) => {
  const ids = items.map((item) => idTxt(item.productoId))
  const prods = await Producto.find({ _id: { $in: ids } })
  const precios = new Map(prods.map((prod) => [prod._id.toString(), prod.precio]))

  return items.reduce((total, item) => {
    const precio = precios.get(idTxt(item.productoId)) || 0
    return total + precio * item.cantidad
  }, 0)
}

export const agregarAlCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params
    const { productoId, cantidad = 1 } = req.body
    const cant = Number(cantidad)

    if (!productoId || !cant || cant < 1) {
      return res.status(400).json({ msg: 'Producto y cantidad validos son obligatorios' })
    }

    const prod = await Producto.findById(productoId)
    if (!prod) {
      return res.status(404).json({ msg: 'Producto no encontrado' })
    }

    let carrito = await Carrito.findOne({ usuarioId })
    if (!carrito) {
      carrito = await Carrito.create({ usuarioId, items: [] })
    }

    const item = carrito.items.find((it) => idTxt(it.productoId) === productoId)

    if (item) {
      item.cantidad += cant
    } else {
      carrito.items.push({ productoId, cantidad: cant })
    }

    carrito.total = await recalcularTotal(carrito.items)
    await carrito.save()
    await carrito.populate('items.productoId')

    res.status(200).json(carrito)
  } catch (err) {
    // console.log('carrito add fail', err)
    res.status(500).json({ msg: 'No se pudo agregar al carrito', error: err.message })
  }
}

export const obtenerCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params
    const carrito = await Carrito.findOne({ usuarioId }).populate('items.productoId')

    if (!carrito) {
      return res.json({ usuarioId, items: [], total: 0 })
    }

    res.json(carrito)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo traer el carrito', error: err.message })
  }
}

export const eliminarDelCarrito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params
    const carrito = await Carrito.findOne({ usuarioId })

    if (!carrito) {
      return res.status(404).json({ msg: 'Carrito no encontrado' })
    }

    carrito.items = carrito.items.filter((item) => idTxt(item.productoId) !== productoId)
    carrito.total = await recalcularTotal(carrito.items)
    await carrito.save()
    await carrito.populate('items.productoId')

    res.json(carrito)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo quitar el producto', error: err.message })
  }
}

export const limpiarCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params
    const carrito = await Carrito.findOneAndUpdate(
      { usuarioId },
      { items: [], total: 0 },
      { new: true, upsert: true },
    )

    res.json(carrito)
  } catch (err) {
    // console.log('limpiar carrito fail', err)
    res.status(500).json({ msg: 'No se pudo limpiar el carrito', error: err.message })
  }
}
