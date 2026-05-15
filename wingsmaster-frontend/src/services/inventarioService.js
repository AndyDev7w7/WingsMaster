import { apiRequest } from './apiClient'

export const inventarioService = {
  async listarInventario() {
    try {
      return await apiRequest('inventario', '/api/inventario')
    } catch {
      return []
    }
  },

  async obtenerAlertas() {
    try {
      return await apiRequest('inventario', '/api/inventario/alertas')
    } catch {
      return []
    }
  },

  async actualizarStock(data, id) {
    return apiRequest('inventario', id ? `/api/inventario/${id}` : '/api/inventario', {
      method: id ? 'PUT' : 'POST',
      body: data,
    })
  },
}
