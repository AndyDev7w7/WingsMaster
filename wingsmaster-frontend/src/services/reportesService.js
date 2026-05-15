import { apiRequest } from './apiClient'

export const reportesService = {
  async dashboard() {
    try {
      return await apiRequest('reportes', '/api/reportes/dashboard')
    } catch {
      return {
        kpis: {
          pedidosTotales: 0,
          ventasTotales: 0,
          totalFacturas: 0,
          pedidosEntregados: 0,
          pedidosPendientes: 0,
        },
        porEstado: {},
        ventasPorDia: [],
        productosTop: [],
        pagosMetodo: [],
        pedidosRecientes: [],
      }
    }
  },

  async ventasTotales() {
    try {
      return await apiRequest('reportes', '/api/reportes/ventas-totales')
    } catch {
      return { ventasTotales: 0, totalFacturas: 0 }
    }
  },

  async productoMasVendido() {
    try {
      return await apiRequest('reportes', '/api/reportes/producto-mas-vendido')
    } catch {
      return { msg: 'Sin ventas registradas' }
    }
  },

  async metricasMensuales() {
    try {
      return await apiRequest('reportes', '/api/reportes/metricas-mensuales')
    } catch {
      return []
    }
  },
}
