import { Router } from 'express'
import {
  metricasMensuales,
  obtenerVentasTotales,
  productoMasVendido,
} from '../controllers/reporteController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/ventas-totales', protect, authorizeRoles('administrador', 'empleado'), obtenerVentasTotales)
router.get('/producto-mas-vendido', protect, authorizeRoles('administrador', 'empleado'), productoMasVendido)
router.get('/metricas-mensuales', protect, authorizeRoles('administrador', 'empleado'), metricasMensuales)

export default router
