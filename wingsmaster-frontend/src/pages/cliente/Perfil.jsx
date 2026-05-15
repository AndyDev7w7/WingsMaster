import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { ActionButton } from '../../components/ActionButton'
import { Notice } from '../../components/Notice'
import { useAuth } from '../../hooks/useAuth'

export function Perfil() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    nombre: user?.nombre || user?.username || 'Cliente Krunchy',
    email: user?.email || 'cliente@krunchy.local',
    telefono: user?.telefono || '+57 300 123 4567',
    direccion: user?.direccion || 'Calle 10 #45-67, Medellín',
  })
  const [msg, setMsg] = useState('')

  const save = async () => {
    await updateProfile(form)
    setMsg('Perfil actualizado correctamente')
    window.setTimeout(() => setMsg(''), 1800)
  }

  const reset = () => {
    setForm({
      nombre: user?.nombre || user?.username || 'Cliente Krunchy',
      email: user?.email || 'cliente@krunchy.local',
      telefono: user?.telefono || '+57 300 123 4567',
      direccion: user?.direccion || 'Calle 10 #45-67, Medellín',
    })
  }

  return (
    <section className="profile-screen">
      <div className="welcome-panel">
        <h1>Bienvenido a WingsMaster</h1>
        <p>Krunchy Alitas</p>
        <strong>Las mejores alitas de Medellín</strong>
      </div>
      <div className="profile-card">
        <h2>Mi Perfil</h2>
        <Notice type="success">{msg}</Notice>
        <div className="profile-head">
          <Avatar name={form.nombre} size="lg" />
          <div>
            <h3>{form.nombre}</h3>
            <p>{form.email}</p>
          </div>
        </div>
        <div className="profile-form">
          {[
            ['nombre', 'Nombre completo'],
            ['email', 'Correo electrónico'],
            ['telefono', 'Teléfono'],
            ['direccion', 'Dirección'],
          ].map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          ))}
        </div>
        <div className="form-actions">
          <ActionButton variant="ghost" icon={X} onClick={reset}>
            Cancelar
          </ActionButton>
          <ActionButton icon={Save} onClick={save}>
            Guardar cambios
          </ActionButton>
        </div>
      </div>
    </section>
  )
}
