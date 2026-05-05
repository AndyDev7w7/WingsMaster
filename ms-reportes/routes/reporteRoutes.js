import { Router } from 'express'
import {
  metricasMensuales,
  obtenerVentasTotales,
  productoMasVendido,
} from '../controllers/reporteController.js'

const router = Router()

router.get('/ventas-totales', obtenerVentasTotales)
router.get('/producto-mas-vendido', productoMasVendido)
router.get('/metricas-mensuales', metricasMensuales)

export default router
