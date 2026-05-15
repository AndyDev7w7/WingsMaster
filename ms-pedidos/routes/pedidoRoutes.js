import { Router } from 'express'
import {
  actualizarEstado,
  crearPedido,
  eliminarPedido,
  obtenerPedidoPorId,
  obtenerPedidos,
  obtenerMisPedidos,
} from '../controllers/pedidoController.js'
import { authorizeRoles, mismoUsuarioOStaff, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, authorizeRoles('administrador', 'empleado', 'repartidor'), obtenerPedidos)
router.post('/', protect, authorizeRoles('cliente', 'administrador', 'empleado'), crearPedido)
router.get('/mis/:usuarioId', protect, mismoUsuarioOStaff(), obtenerMisPedidos)
router.get('/:id', protect, authorizeRoles('cliente', 'administrador', 'empleado', 'repartidor'), obtenerPedidoPorId)
router.put('/:id/estado', protect, authorizeRoles('administrador', 'empleado', 'repartidor'), actualizarEstado)
router.delete('/:id', protect, authorizeRoles('administrador', 'empleado'), eliminarPedido)

export default router
