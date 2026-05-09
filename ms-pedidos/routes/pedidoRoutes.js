import { Router } from 'express'
import {
  actualizarEstado,
  crearPedido,
  obtenerMisPedidos,
} from '../controllers/pedidoController.js'
import { authorizeRoles, mismoUsuarioOStaff, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', protect, authorizeRoles('cliente', 'administrador', 'empleado'), crearPedido)
router.get('/mis/:usuarioId', protect, mismoUsuarioOStaff(), obtenerMisPedidos)
router.put('/:id/estado', protect, authorizeRoles('administrador', 'empleado'), actualizarEstado)

export default router
