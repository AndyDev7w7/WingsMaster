import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, PackagePlus } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { DataTable } from '../../components/DataTable'
import { SearchBox, SelectFilter } from '../../components/Filters'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { inventarioService } from '../../services/inventarioService'

const emptyForm = {
  itemNombre: 'Alitas',
  stockActual: 0,
  stockMinimo: 0,
  unidadMedida: 'unidades',
}

export function InventarioAdmin() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const data = await inventarioService.listarInventario()
    setItems(data)
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  const alertas = items.filter((item) => item.stockActual <= item.stockMinimo)

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const bySearch = item.itemNombre.toLowerCase().includes(search.toLowerCase())
        const byState =
          estado === 'Todos' ||
          (estado === 'Stock bajo' && item.stockActual <= item.stockMinimo) ||
          (estado === 'Suficiente' && item.stockActual > item.stockMinimo)
        return bySearch && byState
      }),
    [items, search, estado],
  )

  const openEdit = (item = emptyForm) => {
    setForm({ ...emptyForm, ...item })
    setModal(true)
  }

  const save = async () => {
    await inventarioService.actualizarStock(
      {
        ...form,
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
      },
      form._id,
    )
    setMsg('Inventario actualizado')
    setModal(false)
    await load()
  }

  return (
    <section className="panel-page">
      <div className="page-head">
        <h1>Gestión de Inventario</h1>
        <ActionButton icon={PackagePlus} onClick={() => openEdit()}>Movimiento de inventario</ActionButton>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="filter-row">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar producto..." />
        <SelectFilter label="Estado" value={estado} onChange={setEstado} options={['Todos', 'Stock bajo', 'Suficiente']} />
      </div>
      <div className="alert-strip">
        <AlertTriangle size={20} />
        Atención: hay {alertas.length} insumos con stock bajo que necesitan ser reabastecidos.
      </div>
      <DataTable
        rows={filtered.map((item) => ({ ...item, highlight: item.stockActual <= item.stockMinimo }))}
        onView={openEdit}
        onEdit={openEdit}
        onDelete={(row) => openEdit({ ...row, stockActual: 0 })}
        columns={[
          { key: 'itemNombre', label: 'Insumo' },
          { key: 'stockActual', label: 'Stock' },
          {
            key: 'stockMinimo',
            label: 'Stock mínimo',
            render: (row) =>
              row.stockActual <= row.stockMinimo ? <StatusBadge value="Stock bajo" tone="warning" /> : row.stockMinimo,
          },
          { key: 'unidadMedida', label: 'Unidad' },
        ]}
      />
      <Modal open={modal} title="Movimiento de inventario" onClose={() => setModal(false)} footer={<ActionButton onClick={save}>Guardar movimiento</ActionButton>}>
        <div className="form-grid">
          <label>Insumo<select value={form.itemNombre} onChange={(e) => setForm({ ...form, itemNombre: e.target.value })}><option>Alitas</option><option>Salsas</option><option>Empaques</option></select></label>
          <label>Unidad<input value={form.unidadMedida} onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })} /></label>
          <label>Stock actual<input type="number" value={form.stockActual} onChange={(e) => setForm({ ...form, stockActual: e.target.value })} /></label>
          <label>Stock mínimo<input type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} /></label>
        </div>
      </Modal>
    </section>
  )
}
