import { Router } from 'express'
import { crearUsr, listarUsers, pingUsuarios } from '../controllers/usrController.js'

const router = Router()

router.get('/ping', pingUsuarios)
router.get('/', listarUsers)
router.post('/', crearUsr)

export default router
