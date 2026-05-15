const API_BASES = {
  usuarios: import.meta.env.VITE_MS_USUARIOS_URL || 'http://127.0.0.1:3000',
  productos: import.meta.env.VITE_MS_PRODUCTOS_URL || 'http://127.0.0.1:3001',
  pedidos: import.meta.env.VITE_MS_PEDIDOS_URL || 'http://127.0.0.1:3002',
  inventario: import.meta.env.VITE_MS_INVENTARIO_URL || 'http://127.0.0.1:3003',
  pagos: import.meta.env.VITE_MS_PAGOS_URL || 'http://127.0.0.1:3004',
  reportes: import.meta.env.VITE_MS_REPORTES_URL || 'http://127.0.0.1:3005',
}

const buildUrl = (service, path) => `${API_BASES[service]}${path}`

export const getToken = () => localStorage.getItem('wm_token')

export const apiRequest = async (service, path, options = {}) => {
  const token = options.token || getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(buildUrl(service, path), {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const msg = data?.msg || data?.error || 'No se pudo completar la solicitud'
    throw new Error(msg)
  }

  return data
}

export const apiBases = API_BASES
