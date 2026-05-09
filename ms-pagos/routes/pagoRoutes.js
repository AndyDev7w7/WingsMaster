import { Router } from 'express'
import {
  generarFactura,
  obtenerHistorial,
  procesarPago,
} from '../controllers/pagoController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/procesar', protect, authorizeRoles('cliente', 'administrador', 'empleado'), procesarPago)
router.post('/factura', protect, authorizeRoles('cliente', 'administrador', 'empleado'), generarFactura)
router.get('/historial', protect, authorizeRoles('administrador', 'empleado'), obtenerHistorial)

export default router
