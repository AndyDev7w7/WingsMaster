import Producto from '../models/Producto.js'

export const obtenerProductos = async (req, res) => {
  try {
    const prods = await Producto.find().sort({ createdAt: -1 })
    res.json(prods)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo traer el catalogo', error: err.message })
  }
}

export const obtenerProductoPorId = async (req, res) => {
  try {
    const prod = await Producto.findById(req.params.id)

    if (!prod) {
      return res.status(404).json({ msg: 'Producto no encontrado' })
    }

    res.json(prod)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo traer el producto', error: err.message })
  }
}

export const crearProducto = async (req, res) => {
  try {
    const dataProd = req.body
    // console.log('prod nuevo:', dataProd.nombre)

    const prod = await Producto.create(dataProd)
    res.status(201).json(prod)
  } catch (err) {
    // console.log('fallo creando prod', err)
    res.status(400).json({ msg: 'No se pudo crear el producto', error: err.message })
  }
}

export const actualizarProducto = async (req, res) => {
  try {
    const prod = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    })

    if (!prod) {
      return res.status(404).json({ msg: 'Producto no encontrado' })
    }

    res.json(prod)
  } catch (err) {
    res.status(400).json({ msg: 'No se pudo actualizar el producto', error: err.message })
  }
}

export const eliminarProducto = async (req, res) => {
  try {
    const prod = await Producto.findByIdAndDelete(req.params.id)

    if (!prod) {
      return res.status(404).json({ msg: 'Producto no encontrado' })
    }

    res.json({ msg: 'Producto eliminado', id: prod._id })
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo eliminar el producto', error: err.message })
  }
}
