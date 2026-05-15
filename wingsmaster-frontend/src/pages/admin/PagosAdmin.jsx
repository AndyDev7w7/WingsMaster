import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { DataTable } from '../../components/DataTable'
import { SearchBox, SelectFilter } from '../../components/Filters'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { pagosService } from '../../services/pagosService'
import { shortMoney } from '../../utils/formatters'

const emptyPago = {
  pedidoId: '',
  cliente: '',
  metodoPago: 'Pago en efectivo',
  monto: 0,
  estado: 'Completado',
}

export function PagosAdmin() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [metodo, setMetodo] = useState('Todos')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyPago)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const data = await pagosService.listarPagos()
    setRows(data)
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  const filtered = useMemo(
    () =>
      rows.filter((pago) => {
        const bySearch = `${pago._id} ${pago.pedidoId} ${pago.cliente}`.toLowerCase().includes(search.toLowerCase())
        const byState = estado === 'Todos' || pago.estado === estado
        const byMethod = metodo === 'Todos' || pago.metodoPago === metodo
        return bySearch && byState && byMethod
      }),
    [rows, search, estado, metodo],
  )

  const save = async () => {
    if (modal === 'editar') {
      await pagosService.actualizarPago(form._id, { ...form, monto: Number(form.monto) })
      setMsg('Pago actualizado')
    } else {
      await pagosService.generarFactura({ ...form, monto: Number(form.monto) })
      setMsg('Pago registrado')
    }
    setModal(null)
    await load()
  }

  const anular = async (pago) => {
    await pagosService.anularPago(pago._id)
    setMsg('Pago anulado')
    await load()
  }

  return (
    <section className="panel-page">
      <div className="page-head">
        <h1>Gestión de Pagos y Facturación</h1>
        <ActionButton icon={Plus} onClick={() => { setForm(emptyPago); setModal('crear') }}>Registrar pago</ActionButton>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="filter-row">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar pago..." />
        <SelectFilter label="Estado" value={estado} onChange={setEstado} options={['Todos', 'Pendiente', 'Completado', 'Anulado']} />
        <SelectFilter label="Método de pago" value={metodo} onChange={setMetodo} options={['Todos', 'Pago en efectivo', 'Transferencia bancaria', 'Tarjeta']} />
      </div>
      <DataTable
        rows={filtered}
        onView={(row) => { setForm(row); setModal('editar') }}
        onEdit={(row) => { setForm(row); setModal('editar') }}
        onDelete={anular}
        columns={[
          { key: '_id', label: 'Pago' },
          { key: 'cliente', label: 'Cliente' },
          { key: 'fecha', label: 'Fecha', render: (row) => new Date(row.fecha || row.createdAt || Date.now()).toLocaleDateString('es-CO') },
          { key: 'metodoPago', label: 'Método de pago' },
          { key: 'monto', label: 'Total', render: (row) => shortMoney(row.monto) },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge value={row.estado} /> },
        ]}
      />
      <Modal open={Boolean(modal)} title={modal === 'editar' ? 'Editar pago' : 'Registrar pago'} onClose={() => setModal(null)} footer={<ActionButton onClick={save}>Guardar pago</ActionButton>}>
        <div className="form-grid">
          <label>Pedido<input value={form.pedidoId} onChange={(e) => setForm({ ...form, pedidoId: e.target.value })} /></label>
          <label>Cliente<input value={form.cliente || ''} onChange={(e) => setForm({ ...form, cliente: e.target.value })} /></label>
          <label>Monto<input type="number" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} /></label>
          <label>Método<select value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}><option>Pago en efectivo</option><option>Transferencia bancaria</option><option>Tarjeta</option></select></label>
          <label>Estado<select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}><option>Pendiente</option><option>Completado</option><option>Anulado</option></select></label>
        </div>
      </Modal>
    </section>
  )
}
