import { apiRequest } from './apiClient'

export const pagosService = {
  async listarPagos() {
    try {
      return await apiRequest('pagos', '/api/pagos/historial')
    } catch {
      return []
    }
  },

  async procesarPago(data) {
    return apiRequest('pagos', '/api/pagos/procesar', { method: 'POST', body: data })
  },

  async generarFactura(data) {
    return apiRequest('pagos', '/api/pagos/factura', { method: 'POST', body: data })
  },

  async actualizarPago(id, data) {
    return apiRequest('pagos', `/api/pagos/${id}`, { method: 'PUT', body: data })
  },

  async anularPago(id) {
    return apiRequest('pagos', `/api/pagos/${id}`, { method: 'DELETE' })
  },
}
