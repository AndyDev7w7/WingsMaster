import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { Avatar } from '../../components/Avatar'
import { DataTable } from '../../components/DataTable'
import { SearchBox, SelectFilter } from '../../components/Filters'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { authService } from '../../services/authService'
import { roleLabel } from '../../utils/formatters'

const roles = ['cliente', 'administrador', 'empleado', 'repartidor']

const emptyUser = {
  username: '',
  nombre: '',
  email: '',
  password: 'Wings12345',
  telefono: '',
  direccion: '',
  role: 'cliente',
  estado: 'Activo',
}

export function UsuariosAdmin() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Todos')
  const [estado, setEstado] = useState('Todos')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyUser)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const data = await authService.listarUsuarios()
    setUsers(data)
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  const rows = useMemo(
    () =>
      users.filter((usr) => {
        const bySearch = `${usr.nombre || usr.username} ${usr.email}`.toLowerCase().includes(search.toLowerCase())
        const byRole = role === 'Todos' || usr.role === role
        const byState = estado === 'Todos' || usr.estado === estado
        return bySearch && byRole && byState
      }),
    [users, search, role, estado],
  )

  const save = async () => {
    if (modal === 'editar') {
      await authService.actualizarUsuario(form._id, form)
      setMsg('Usuario actualizado')
    } else {
      await authService.crearUsuario(form)
      setMsg('Usuario creado')
    }
    setModal(null)
    await load()
  }

  const remove = async (usr) => {
    await authService.desactivarUsuario(usr._id)
    setMsg('Usuario desactivado')
    await load()
  }

  return (
    <section className="panel-page">
      <div className="page-head">
        <h1>Gestión de Usuarios y Roles</h1>
        <ActionButton icon={Plus} onClick={() => { setForm(emptyUser); setModal('crear') }}>Agregar usuario</ActionButton>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="filter-row">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar usuario..." />
        <SelectFilter label="Estado" value={estado} onChange={setEstado} options={['Todos', 'Activo', 'Inactivo']} />
        <SelectFilter label="Rol" value={role} onChange={setRole} options={['Todos', ...roles]} />
      </div>
      <DataTable
        rows={rows}
        onView={(row) => { setForm(row); setModal('editar') }}
        onEdit={(row) => { setForm(row); setModal('editar') }}
        onDelete={remove}
        columns={[
          {
            key: 'usuario',
            label: 'Usuario',
            render: (row) => (
              <div className="cell-user">
                <Avatar name={row.nombre || row.username} />
                <div>
                  <strong>{row.nombre || row.username}</strong>
                  <small>{row.telefono}</small>
                </div>
              </div>
            ),
          },
          { key: 'email', label: 'Correo' },
          {
            key: 'role',
            label: 'Rol',
            render: (row) => <StatusBadge value={roleLabel(row.role)} tone={row.role === 'repartidor' ? 'sky' : 'warning'} />,
          },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge value={row.estado || 'Activo'} /> },
        ]}
      />
      <Modal open={Boolean(modal)} title={modal === 'editar' ? 'Editar usuario' : 'Agregar usuario'} onClose={() => setModal(null)} footer={<ActionButton onClick={save}>Guardar usuario</ActionButton>}>
        <div className="form-grid">
          <label>Nombre<input value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value, username: form.username || e.target.value })} /></label>
          <label>Username<input value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
          <label>Correo<input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          {modal === 'crear' && <label>Contraseña<input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>}
          <label>Teléfono<input value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></label>
          <label>Rol<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((item) => <option key={item} value={item}>{roleLabel(item)}</option>)}</select></label>
          <label>Estado<select value={form.estado || 'Activo'} onChange={(e) => setForm({ ...form, estado: e.target.value })}><option>Activo</option><option>Inactivo</option></select></label>
          <label className="span-2">Dirección<input value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></label>
        </div>
      </Modal>
    </section>
  )
}
