export const money = (value = 0) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export const shortMoney = (value = 0) =>
  money(value).replace(/\s?COP/, '').replace('COP', '').trim()

export const cls = (...items) => items.filter(Boolean).join(' ')

export const roleLabel = (role = '') => {
  const labels = {
    cliente: 'Cliente',
    administrador: 'Administrador',
    empleado: 'Empleado',
    repartidor: 'Repartidor',
  }

  return labels[role] || role
}

export const normalizeRole = (role = 'cliente') => {
  const map = {
    admin: 'administrador',
    player: 'cliente',
    Cliente: 'cliente',
    Administrador: 'administrador',
    Empleado: 'empleado',
    Repartidor: 'repartidor',
  }

  return map[role] || role
}

export const estadoTone = (estado = '') => {
  const tones = {
    Activo: 'success',
    Inactivo: 'danger',
    Disponible: 'success',
    Pendiente: 'warning',
    Preparando: 'info',
    'En proceso': 'info',
    'En camino': 'sky',
    Entregado: 'success',
    Completado: 'success',
    Pagado: 'success',
    Cancelado: 'danger',
  }

  return tones[estado] || 'neutral'
}

export const getUserHome = (role) => {
  const normalized = normalizeRole(role)
  const homes = {
    cliente: '/cliente/catalogo',
    administrador: '/admin/dashboard',
    empleado: '/empleado/pedidos',
    repartidor: '/repartidor/entregas',
  }

  return homes[normalized] || '/login'
}

export const getUserAccount = (role) => {
  const normalized = normalizeRole(role)
  const paths = {
    cliente: '/cliente/cuenta',
    administrador: '/admin/cuenta',
    empleado: '/empleado/cuenta',
    repartidor: '/repartidor/cuenta',
  }

  return paths[normalized] || '/login'
}
