import { apiRequest } from './apiClient'

export const productosService = {
  async listarProductos() {
    try {
      return await apiRequest('productos', '/api/productos')
    } catch {
      return []
    }
  },

  async crearProducto(data) {
    return apiRequest('productos', '/api/productos', { method: 'POST', body: data })
  },

  async actualizarProducto(id, data) {
    return apiRequest('productos', `/api/productos/${id}`, { method: 'PUT', body: data })
  },

  async eliminarProducto(id) {
    return apiRequest('productos', `/api/productos/${id}`, { method: 'DELETE' })
  },

  async obtenerCarrito(usuarioId) {
    return apiRequest('productos', `/api/carrito/${usuarioId}`)
  },

  async agregarAlCarrito(usuarioId, productoId, cantidad) {
    return apiRequest('productos', `/api/carrito/${usuarioId}`, {
      method: 'POST',
      body: { productoId, cantidad },
    })
  },

  async limpiarCarrito(usuarioId) {
    return apiRequest('productos', `/api/carrito/${usuarioId}`, { method: 'DELETE' })
  },

  async actualizarItemCarrito(usuarioId, productoId, cantidad) {
    return apiRequest('productos', `/api/carrito/${usuarioId}/productos/${productoId}`, {
      method: 'PUT',
      body: { cantidad },
    })
  },

  async eliminarDelCarrito(usuarioId, productoId) {
    return apiRequest('productos', `/api/carrito/${usuarioId}/productos/${productoId}`, {
      method: 'DELETE',
    })
  },
}
