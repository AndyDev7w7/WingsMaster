import { Router } from 'express'
import { autenticarUsuario, registrarUsuario } from '../controllers/usuarioController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', registrarUsuario)
router.post('/login', autenticarUsuario)
router.get('/perfil', protect, (req, res) => {
  res.json(req.user)
})

export default router
