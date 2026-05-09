import { Router } from 'express'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from '../controllers/productoController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', obtenerProductos)
router.get('/:id', obtenerProductoPorId)
router.post('/', protect, authorizeRoles('administrador', 'empleado'), crearProducto)
router.put('/:id', protect, authorizeRoles('administrador', 'empleado'), actualizarProducto)
router.delete('/:id', protect, authorizeRoles('administrador', 'empleado'), eliminarProducto)

export default router
