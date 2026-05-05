import { Router } from 'express'
import {
  actualizarStock,
  descontarStock,
  obtenerAlertas,
  obtenerInventario,
} from '../controllers/inventarioController.js'
import { staffOnly } from '../middleware/roleMiddleware.js'

const router = Router()

router.get('/', obtenerInventario)
router.get('/alertas', obtenerAlertas)
router.post('/descontar', descontarStock)
router.post('/', staffOnly, actualizarStock)
router.put('/:id', staffOnly, actualizarStock)

export default router
