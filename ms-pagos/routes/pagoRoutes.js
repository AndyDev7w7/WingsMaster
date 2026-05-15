import { Router } from 'express'
import {
  actualizarPago,
  anularPago,
  generarFactura,
  obtenerHistorial,
  procesarPago,
} from '../controllers/pagoController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/procesar', protect, authorizeRoles('cliente', 'administrador', 'empleado'), procesarPago)
router.post('/factura', protect, authorizeRoles('cliente', 'administrador', 'empleado'), generarFactura)
router.get('/historial', protect, authorizeRoles('administrador', 'empleado'), obtenerHistorial)
router.put('/:id', protect, authorizeRoles('administrador', 'empleado'), actualizarPago)
router.delete('/:id', protect, authorizeRoles('administrador', 'empleado'), anularPago)

export default router
