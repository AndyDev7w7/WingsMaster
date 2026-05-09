import { Router } from 'express'
import {
  agregarAlCarrito,
  eliminarDelCarrito,
  limpiarCarrito,
  obtenerCarrito,
} from '../controllers/carritoController.js'
import { mismoUsuarioOStaff, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/:usuarioId', protect, mismoUsuarioOStaff(), obtenerCarrito)
router.post('/:usuarioId', protect, mismoUsuarioOStaff(), agregarAlCarrito)
router.delete('/:usuarioId/productos/:productoId', protect, mismoUsuarioOStaff(), eliminarDelCarrito)
router.delete('/:usuarioId', protect, mismoUsuarioOStaff(), limpiarCarrito)

export default router
