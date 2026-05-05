import { Router } from 'express'
import {
  agregarAlCarrito,
  eliminarDelCarrito,
  limpiarCarrito,
  obtenerCarrito,
} from '../controllers/carritoController.js'

const router = Router()

router.get('/:usuarioId', obtenerCarrito)
router.post('/:usuarioId', agregarAlCarrito)
router.delete('/:usuarioId/productos/:productoId', eliminarDelCarrito)
router.delete('/:usuarioId', limpiarCarrito)

export default router
