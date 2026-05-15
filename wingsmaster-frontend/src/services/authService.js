import { apiRequest } from './apiClient'
import { normalizeRole } from '../utils/formatters'

export const authService = {
  async login({ email, password }) {
    const data = await apiRequest('usuarios', '/api/usuarios/login', {
      method: 'POST',
      body: { email, password },
    })

    return {
      ...data,
      role: normalizeRole(data.role),
      nombre: data.username || data.nombre || data.email,
    }
  },

  async register(data) {
    return apiRequest('usuarios', '/api/usuarios', {
      method: 'POST',
      body: data,
    })
  },

  async profile() {
    return apiRequest('usuarios', '/api/usuarios/perfil')
  },

  async actualizarPerfil(data) {
    return apiRequest('usuarios', '/api/usuarios/perfil', { method: 'PUT', body: data })
  },

  async listarUsuarios() {
    try {
      return await apiRequest('usuarios', '/api/usuarios')
    } catch {
      return []
    }
  },

  async crearUsuario(data) {
    return apiRequest('usuarios', '/api/usuarios/admin', { method: 'POST', body: data })
  },

  async actualizarUsuario(id, data) {
    return apiRequest('usuarios', `/api/usuarios/${id}`, { method: 'PUT', body: data })
  },

  async desactivarUsuario(id) {
    return apiRequest('usuarios', `/api/usuarios/${id}`, { method: 'DELETE' })
  },
}
