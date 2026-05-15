import { useState } from 'react'
import { Bell, LogOut, Search, ShoppingBasket, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserAccount, getUserHome } from '../utils/formatters'
import { Brand } from './Brand'
import { Avatar } from './Avatar'

export function TopBar({ mode = 'backoffice', title = '', placeholder = 'Buscar...' }) {
  const { user, logout } = useAuth()
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const goHome = () => navigate(getUserHome(user?.role))
  const goAccount = () => navigate(getUserAccount(user?.role))

  const goAlerts = () => {
    if (mode === 'cliente') return navigate('/cliente/seguimiento')
    if (user?.role === 'repartidor') return navigate('/repartidor/entregas')
    if (user?.role === 'empleado') return navigate('/empleado/pedidos')
    return navigate('/admin/pedidos')
  }

  const goActivity = () => {
    if (mode === 'cliente') return navigate('/cliente/carrito')
    if (user?.role === 'repartidor') return navigate('/repartidor/asignados')
    if (user?.role === 'empleado') return navigate('/empleado/registrar-pago')
    return navigate('/admin/pagos')
  }

  const submitSearch = (e) => {
    e.preventDefault()
    const query = term.trim()
    if (!query) return goHome()

    const base = mode === 'cliente' ? '/cliente/catalogo' : getUserHome(user?.role)
    navigate(`${base}?buscar=${encodeURIComponent(query)}`)
  }

  return (
    <header className="topbar">
      <button className="brand-btn" onClick={goHome} aria-label="Ir al inicio">
        <Brand />
      </button>
      <form className="topbar-search" onSubmit={submitSearch}>
        <button type="submit" aria-label="Buscar">
          <Search size={20} />
        </button>
        <input
          placeholder={placeholder}
          aria-label={placeholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </form>
      {title && <div className="topbar-filter">{title}</div>}
      <div className="topbar-actions">
        <button aria-label="Notificaciones" onClick={goAlerts}>
          <Bell size={22} />
        </button>
        <button aria-label={mode === 'cliente' ? 'Carrito' : 'Actividad'} onClick={goActivity}>
          {mode === 'cliente' ? <ShoppingCart size={22} /> : <ShoppingBasket size={22} />}
        </button>
        <button className="topbar-user" onClick={goAccount} aria-label="Gestionar cuenta">
          <Avatar name={user?.nombre || user?.username || 'Usuario'} size="sm" />
          <span>{user?.nombre?.split(' ')[0] || user?.username || 'Usuario'}</span>
        </button>
        <button className="logout-pill" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  )
}
