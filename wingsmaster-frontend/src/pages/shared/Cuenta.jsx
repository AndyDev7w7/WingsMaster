import { useState } from 'react'
import { Bell, CreditCard, Home, KeyRound, LogOut, Save, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ActionButton } from '../../components/ActionButton'
import { Avatar } from '../../components/Avatar'
import { Notice } from '../../components/Notice'
import { useAuth } from '../../hooks/useAuth'
import { getUserHome, roleLabel } from '../../utils/formatters'

export function Cuenta() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: user?.nombre || user?.username || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
  })
  const [prefs, setPrefs] = useState({
    notificaciones: true,
    promos: true,
    seguridad: true,
  })
  const [pass, setPass] = useState({ actual: '', nueva: '' })
  const [msg, setMsg] = useState('')

  const save = async () => {
    await updateProfile(form)
    setMsg('Cuenta actualizada correctamente')
    window.setTimeout(() => setMsg(''), 1800)
  }

  const savePass = () => {
    setPass({ actual: '', nueva: '' })
    setMsg('Cambio de contraseña simulado para esta demo')
    window.setTimeout(() => setMsg(''), 1800)
  }

  const closeSession = () => {
    logout()
    navigate('/login')
  }

  return (
    <section className="account-page">
      <div className="account-hero">
        <Avatar name={form.nombre || user?.username} size="lg" />
        <div>
          <span>{roleLabel(user?.role)}</span>
          <h1>{form.nombre || user?.username}</h1>
          <p>{form.email}</p>
        </div>
        <ActionButton icon={Home} onClick={() => navigate(getUserHome(user?.role))}>
          Volver al inicio
        </ActionButton>
      </div>

      <Notice type="success">{msg}</Notice>

      <div className="account-grid">
        <article className="account-card">
          <h2><UserRound size={22} /> Datos de la cuenta</h2>
          <div className="form-grid">
            <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
            <label>Correo<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Teléfono<input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></label>
            <label>Dirección<input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></label>
          </div>
          <ActionButton icon={Save} onClick={save}>Guardar datos</ActionButton>
        </article>

        <article className="account-card">
          <h2><KeyRound size={22} /> Seguridad</h2>
          <div className="form-grid">
            <label>Contraseña actual<input type="password" value={pass.actual} onChange={(e) => setPass({ ...pass, actual: e.target.value })} /></label>
            <label>Nueva contraseña<input type="password" value={pass.nueva} onChange={(e) => setPass({ ...pass, nueva: e.target.value })} /></label>
          </div>
          <ActionButton icon={ShieldCheck} onClick={savePass}>Actualizar contraseña</ActionButton>
        </article>

        <article className="account-card">
          <h2><Bell size={22} /> Preferencias</h2>
          {[
            ['notificaciones', 'Notificaciones de pedidos'],
            ['promos', 'Promociones de Krunchy'],
            ['seguridad', 'Alertas de seguridad'],
          ].map(([key, label]) => (
            <button
              className={`pref-toggle ${prefs[key] ? 'active' : ''}`}
              key={key}
              onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
            >
              <span>{label}</span>
              <b>{prefs[key] ? 'Activo' : 'Inactivo'}</b>
            </button>
          ))}
        </article>

        <article className="account-card danger-zone">
          <h2><CreditCard size={22} /> Acciones rápidas</h2>
          <button onClick={() => navigate(user?.role === 'cliente' ? '/cliente/historial' : getUserHome(user?.role))}>
            Ver actividad de mi cuenta
          </button>
          <button onClick={closeSession}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </article>
      </div>
    </section>
  )
}
