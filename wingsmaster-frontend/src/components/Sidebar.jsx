import {
  BarChart3,
  Boxes,
  ClipboardList,
  CreditCard,
  Home,
  PackagePlus,
  ShoppingBag,
  Truck,
  Users,
  WalletCards,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cls } from '../utils/formatters'

const links = {
  administrador: [
    { to: '/admin/dashboard', label: 'Inicio', icon: Home },
    { to: '/admin/productos', label: 'Productos', icon: ShoppingBag },
    { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
    { to: '/admin/inventario', label: 'Inventario', icon: Boxes },
    { to: '/admin/pagos', label: 'Pagos', icon: CreditCard },
    { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  ],
  empleado: [
    { to: '/empleado/pedidos', label: 'Pedidos', icon: ClipboardList },
    { to: '/empleado/productos', label: 'Productos', icon: ShoppingBag },
    { to: '/empleado/inventario', label: 'Inventario', icon: Boxes },
    { to: '/empleado/registrar-pago', label: 'Registrar pago', icon: WalletCards },
    { to: '/empleado/pagos', label: 'Facturación', icon: CreditCard },
  ],
  repartidor: [
    { to: '/repartidor/entregas', label: 'Entregas', icon: Truck },
    { to: '/repartidor/asignados', label: 'Asignados', icon: PackagePlus },
  ],
}

export function Sidebar({ role = 'administrador', extra }) {
  return (
    <aside className="sidebar">
      <nav>
        {(links[role] || links.administrador).map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              className={({ isActive }) => cls('side-link', isActive && 'active')}
              to={item.to}
              key={`${item.to}-${item.label}`}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
      {extra && <div className="sidebar-extra">{extra}</div>}
    </aside>
  )
}
