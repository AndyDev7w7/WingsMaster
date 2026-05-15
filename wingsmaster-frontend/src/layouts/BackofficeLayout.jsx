import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../hooks/useAuth'

export function BackofficeLayout({ role = 'administrador', sidebarExtra, title = 'Últimos 7 días' }) {
  const { user } = useAuth()
  const currentRole = role || user?.role || 'administrador'

  return (
    <div className="app-frame">
      <TopBar title={title} placeholder="Buscar..." />
      <div className="workbench">
        <Sidebar role={currentRole} extra={sidebarExtra} />
        <main className="workspace">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
