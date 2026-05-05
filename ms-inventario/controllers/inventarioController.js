import Inventario from '../models/Inventario.js'

export const obtenerInventario = async (req, res) => {
  try {
    const items = await Inventario.find().sort({ itemNombre: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudo traer inventario', error: err.message })
  }
}

export const descontarStock = async (req, res) => {
  try {
    const { items = [] } = req.body

    if (!items.length) {
      return res.status(400).json({ msg: 'No llegaron items para descontar' })
    }

    const movs = []

    for (const item of items) {
      const cant = Number(item.cantidad || 0)
      if (!item.itemNombre || cant <= 0) continue

      const inv = await Inventario.findOne({ itemNombre: item.itemNombre })
      if (!inv) {
        movs.push({ itemNombre: item.itemNombre, ok: false, msg: 'No existe' })
        continue
      }

      inv.stockActual = Math.max(inv.stockActual - cant, 0)
      await inv.save()
      movs.push({ itemNombre: inv.itemNombre, stockActual: inv.stockActual, ok: true })
    }

    res.json({ msg: 'Stock descontado', movs })
  } catch (err) {
    // console.log('stock desc fail', err)
    res.status(500).json({ msg: 'No se pudo descontar stock', error: err.message })
  }
}

export const actualizarStock = async (req, res) => {
  try {
    const { itemNombre, stockActual, stockMinimo, unidadMedida } = req.body
    const filtro = req.params.id ? { _id: req.params.id } : { itemNombre }

    const item = await Inventario.findOneAndUpdate(
      filtro,
      { itemNombre, stockActual, stockMinimo, unidadMedida },
      { new: true, upsert: true, runValidators: true },
    )

    res.json(item)
  } catch (err) {
    // console.log('stock update fail', err)
    res.status(400).json({ msg: 'No se pudo actualizar stock', error: err.message })
  }
}

export const obtenerAlertas = async (req, res) => {
  try {
    const alertas = await Inventario.find({
      $expr: { $lte: ['$stockActual', '$stockMinimo'] },
    }).sort({ itemNombre: 1 })

    res.json(alertas)
  } catch (err) {
    res.status(500).json({ msg: 'No se pudieron traer alertas', error: err.message })
  }
}
