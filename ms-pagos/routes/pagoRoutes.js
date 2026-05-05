import { Router } from 'express'
import {
  generarFactura,
  obtenerHistorial,
  procesarPago,
} from '../controllers/pagoController.js'

const router = Router()

router.post('/procesar', procesarPago)
router.post('/factura', generarFactura)
router.get('/historial', obtenerHistorial)

export default router
