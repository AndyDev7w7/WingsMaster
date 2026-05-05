import { Router } from 'express'
import {
  actualizarEstado,
  crearPedido,
  obtenerMisPedidos,
} from '../controllers/pedidoController.js'
import { staffOnly } from '../middleware/roleMiddleware.js'

const router = Router()

router.post('/', crearPedido)
router.get('/mis/:usuarioId', obtenerMisPedidos)
router.put('/:id/estado', staffOnly, actualizarEstado)

export default router
