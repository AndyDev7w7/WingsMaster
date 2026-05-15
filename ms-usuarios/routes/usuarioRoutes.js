import { Router } from 'express'
import {
  actualizarPerfil,
  actualizarUsuario,
  autenticarUsuario,
  desactivarUsuario,
  obtenerUsuarios,
  registrarUsuario,
} from '../controllers/usuarioController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', registrarUsuario)
router.post('/login', autenticarUsuario)
router.post('/admin', protect, authorizeRoles('administrador'), registrarUsuario)
router.get('/', protect, authorizeRoles('administrador'), obtenerUsuarios)
router.get('/perfil', protect, (req, res) => {
  res.json(req.user)
})
router.put('/perfil', protect, actualizarPerfil)
router.put('/:id', protect, authorizeRoles('administrador'), actualizarUsuario)
router.delete('/:id', protect, authorizeRoles('administrador'), desactivarUsuario)

export default router
