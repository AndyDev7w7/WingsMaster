import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { DataTable } from '../../components/DataTable'
import { SearchBox, SelectFilter } from '../../components/Filters'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { productosService } from '../../services/productosService'
import { shortMoney } from '../../utils/formatters'
import wingBox from '../../assets/brand/wing-box.svg'

const emptyForm = {
  nombre: '',
  descripcion: '',
  precio: 0,
  imagen: '',
  categoria: 'Combos',
  disponible: true,
}

const catOpts = ['Alitas', 'Combos', 'Acompañantes', 'Bebidas', 'Salsas', 'Promociones']

export function ProductosAdmin() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [estado, setEstado] = useState('Todos')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const data = await productosService.listarProductos()
    setRows(data)
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  const filtered = useMemo(
    () =>
      rows.filter((prod) => {
        const bySearch = prod.nombre.toLowerCase().includes(search.toLowerCase())
        const byCat = categoria === 'Todas' || prod.categoria === categoria
        const byState =
          estado === 'Todos' ||
          (estado === 'Activos' && prod.disponible) ||
          (estado === 'Inactivos' && !prod.disponible)
        return bySearch && byCat && byState
      }),
    [rows, search, categoria, estado],
  )

  const openCreate = () => {
    setForm(emptyForm)
    setModal('crear')
  }

  const openEdit = (prod) => {
    setForm({ ...emptyForm, ...prod })
    setModal('editar')
  }

  const save = async () => {
    const payload = { ...form, precio: Number(form.precio), disponible: Boolean(form.disponible) }
    if (modal === 'editar') {
      await productosService.actualizarProducto(form._id, payload)
      setMsg('Producto actualizado')
    } else {
      await productosService.crearProducto(payload)
      setMsg('Producto creado')
    }
    setModal(null)
    await load()
  }

  const remove = async (prod) => {
    await productosService.eliminarProducto(prod._id)
    setMsg('Producto eliminado')
    await load()
  }

  return (
    <section className="panel-page">
      <div className="page-head">
        <h1>Gestión de Productos</h1>
        <ActionButton icon={Plus} onClick={openCreate}>Agregar producto</ActionButton>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="filter-row">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar producto..." />
        <SelectFilter label="Categoría" value={categoria} onChange={setCategoria} options={['Todas', ...catOpts]} />
        <SelectFilter label="Estado" value={estado} onChange={setEstado} options={['Todos', 'Activos', 'Inactivos']} />
      </div>
      <DataTable
        rows={filtered}
        onView={openEdit}
        onEdit={openEdit}
        onDelete={remove}
        columns={[
          {
            key: 'nombre',
            label: 'Producto',
            render: (row) => (
              <div className="cell-product">
                <img
                  src={row.imagen || wingBox}
                  alt={row.nombre}
                  onError={(e) => {
                    e.currentTarget.src = wingBox
                  }}
                />
                <strong>{row.nombre}</strong>
              </div>
            ),
          },
          { key: 'categoria', label: 'Categoría' },
          { key: 'precio', label: 'Precio', render: (row) => shortMoney(row.precio) },
          {
            key: 'estado',
            label: 'Estado',
            render: (row) => <StatusBadge value={row.disponible ? 'Disponible' : 'Inactivo'} />,
          },
        ]}
      />
      <Modal
        open={Boolean(modal)}
        title={modal === 'editar' ? 'Editar producto' : 'Agregar producto'}
        onClose={() => setModal(null)}
        footer={<ActionButton onClick={save}>Guardar</ActionButton>}
      >
        <div className="form-grid">
          <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
          <label>Precio<input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} /></label>
          <label>Categoría<select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>{catOpts.map((cat) => <option key={cat}>{cat}</option>)}</select></label>
          <label>Estado<select value={form.disponible ? 'true' : 'false'} onChange={(e) => setForm({ ...form, disponible: e.target.value === 'true' })}><option value="true">Disponible</option><option value="false">Inactivo</option></select></label>
          <label className="span-2">Descripción<textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></label>
          <label className="span-2">URL de imagen<input value={form.imagen || ''} onChange={(e) => setForm({ ...form, imagen: e.target.value })} /></label>
        </div>
      </Modal>
    </section>
  )
}
