import { Router } from 'express'
import {
  actualizarStock,
  descontarStock,
  obtenerAlertas,
  obtenerInventario,
} from '../controllers/inventarioController.js'
import { authorizeRoles, internalOrRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, authorizeRoles('administrador', 'empleado'), obtenerInventario)
router.get('/alertas', protect, authorizeRoles('administrador', 'empleado'), obtenerAlertas)
router.post('/descontar', internalOrRoles('administrador', 'empleado'), descontarStock)
router.post('/', protect, authorizeRoles('administrador', 'empleado'), actualizarStock)
router.put('/:id', protect, authorizeRoles('administrador', 'empleado'), actualizarStock)

export default router
