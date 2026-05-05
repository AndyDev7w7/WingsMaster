import { Router } from 'express'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from '../controllers/productoController.js'

const router = Router()

router.get('/', obtenerProductos)
router.get('/:id', obtenerProductoPorId)
router.post('/', crearProducto)
router.put('/:id', actualizarProducto)
router.delete('/:id', eliminarProducto)

export default router
