import { Outlet } from 'react-router-dom'
import { TopBar } from '../components/TopBar'

export function ClientLayout() {
  return (
    <div className="app-frame client-frame">
      <TopBar mode="cliente" placeholder="Buscar productos..." />
      <Outlet />
      <footer className="client-footer">
        Krunchy Alitas - Medellín, Colombia • Contáctanos: +57 300 555 1234 •
        www.krunchyalitas.com
      </footer>
    </div>
  )
}
