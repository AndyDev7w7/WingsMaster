import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { Brand } from '../../components/Brand'
import { useAuth } from '../../hooks/useAuth'
import { getUserHome } from '../../utils/formatters'

export function Login() {
  const [form, setForm] = useState({ email: 'cliente@krunchy.local', password: 'Wings12345' })
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(form)
      navigate(location.state?.from?.pathname || getUserHome(user.role))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <Brand />
        <h1>Iniciar sesión</h1>
        <label>
          Correo electrónico
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="text"
            inputMode="email"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <ActionButton icon={LogIn} className="w-full justify-center" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </ActionButton>
        <p>
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </form>
    </main>
  )
}
