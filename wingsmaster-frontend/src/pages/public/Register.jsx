import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { Brand } from '../../components/Brand'
import { useAuth } from '../../hooks/useAuth'

export function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
  })
  const [error, setError] = useState('')
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/cliente/catalogo')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="auth-shell">
      <form className="auth-card auth-wide" onSubmit={submit}>
        <Brand />
        <h1>Crear cuenta</h1>
        <div className="form-grid">
          <label>
            Nombre completo
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </label>
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
            Teléfono
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </label>
          <label>
            Dirección
            <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </label>
          <label className="form-grid-full">
            Contraseña
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              required
            />
          </label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <ActionButton icon={UserPlus} className="w-full justify-center" disabled={loading}>
          Crear cuenta
        </ActionButton>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </main>
  )
}
