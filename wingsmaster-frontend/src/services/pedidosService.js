import { apiRequest } from './apiClient'

export const pedidosService = {
  async listarPedidos(usuarioId) {
    try {
      return await apiRequest('pedidos', usuarioId ? `/api/pedidos/mis/${usuarioId}` : '/api/pedidos')
    } catch {
      return []
    }
  },

  async obtenerPedido(id) {
    return apiRequest('pedidos', `/api/pedidos/${id}`)
  },

  async crearPedido(data) {
    return apiRequest('pedidos', '/api/pedidos', { method: 'POST', body: data })
  },

  async actualizarEstado(id, estado) {
    return apiRequest('pedidos', `/api/pedidos/${id}/estado`, {
      method: 'PUT',
      body: { estado },
    })
  },

  async cancelarPedido(id) {
    return apiRequest('pedidos', `/api/pedidos/${id}`, { method: 'DELETE' })
  },
}
