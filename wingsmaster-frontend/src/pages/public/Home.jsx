import { Link, Navigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Brand } from '../../components/Brand'
import { ActionButton } from '../../components/ActionButton'
import { useAuth } from '../../hooks/useAuth'
import wingBox from '../../assets/brand/wing-box.svg'
import { getUserHome } from '../../utils/formatters'

export function Home() {
  const { user } = useAuth()
  if (user) return <Navigate to={getUserHome(user.role)} replace />

  return (
    <main className="landing-shell">
      <section className="landing-card">
        <div className="landing-art">
          <Brand />
          <div>
            <h1>Bienvenido a WingsMaster</h1>
            <p>Krunchy Alitas</p>
          </div>
          <img src={wingBox} alt="Alitas Krunchy" />
          <strong>Las mejores alitas de Medellín</strong>
        </div>
        <div className="landing-panel">
          <h2>Accede al sistema</h2>
          <p>
            Plataforma web para clientes, administradores, empleados y repartidores de Krunchy
            Alitas.
          </p>
          <div className="landing-actions">
            <Link to="/login">
              <ActionButton icon={ArrowRight}>Iniciar sesión</ActionButton>
            </Link>
            <Link to="/registro">
              <ActionButton variant="gold" icon={ArrowRight}>
                Crear cuenta
              </ActionButton>
            </Link>
          </div>
          <div className="demo-access">
            <span>Usuarios demo</span>
            <p>admin@krunchy.local / cliente@krunchy.local / empleado@krunchy.local</p>
            <small>Password: Wings12345</small>
          </div>
        </div>
      </section>
    </main>
  )
}
