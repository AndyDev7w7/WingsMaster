import { useEffect, useMemo, useState } from 'react'
import { Check, Eye, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { SearchBox, SelectFilter } from '../../components/Filters'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

const flow = ['Pendiente', 'Preparando', 'Listo', 'En camino', 'Entregado']

export function PedidosAdmin() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [selected, setSelected] = useState(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const data = await pedidosService.listarPedidos()
    setRows(data)
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  const filtered = useMemo(
    () =>
      rows.filter((pedido) => {
        const bySearch = `${pedido._id} ${pedido.cliente}`.toLowerCase().includes(search.toLowerCase())
        const byState = estado === 'Todos' || pedido.estado === estado
        return bySearch && byState
      }),
    [rows, search, estado],
  )

  const resumen = ['Pendiente', 'Preparando', 'En camino', 'Entregado'].map((item) => ({
    label: item,
    count: rows.filter((pedido) => pedido.estado === item).length,
  }))

  const advance = async (pedido) => {
    const idx = flow.indexOf(pedido.estado)
    const next = flow[Math.min(idx + 1, flow.length - 1)]
    await pedidosService.actualizarEstado(pedido._id, next)
    setMsg(`Pedido ${pedido._id} actualizado a ${next}`)
    await load()
  }

  const cancel = async (pedido) => {
    await pedidosService.cancelarPedido(pedido._id)
    setMsg(`Pedido ${pedido._id} cancelado`)
    await load()
  }

  return (
    <section className="panel-page">
      <div className="page-head">
        <h1>Control General de Pedidos</h1>
        <button className="btn btn-primary btn-md" onClick={load}>Actualizar estados</button>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="filter-row">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar pedido..." />
        <SelectFilter label="Estado" value={estado} onChange={setEstado} options={['Todos', 'Pendiente', 'Preparando', 'Listo', 'En camino', 'Entregado', 'Cancelado']} />
      </div>
      <div className="state-tabs">
        {resumen.map((item) => (
          <span key={item.label}>
            {item.label} <b>{item.count}</b>
          </span>
        ))}
      </div>
      <DataTable
        rows={filtered}
        actions
        renderActions={(row) => (
          <div className="table-actions">
            <button onClick={() => setSelected(row)}><Eye size={18} /></button>
            <button onClick={() => advance(row)}><Check size={18} /></button>
            <button onClick={() => cancel(row)}><Trash2 size={18} /></button>
          </div>
        )}
        columns={[
          {
            key: '_id',
            label: 'Orden',
            render: (row) => (
              <div>
                <strong>{row._id}</strong>
                <small>{row.tipo}</small>
              </div>
            ),
          },
          {
            key: 'cliente',
            label: 'Cliente',
            render: (row) => (
              <div>
                <strong>{row.cliente}</strong>
                <small>{row.direccionEnvio}</small>
              </div>
            ),
          },
          { key: 'fecha', label: 'Fecha', render: (row) => new Date(row.createdAt || Date.now()).toLocaleString('es-CO') },
          { key: 'total', label: 'Total', render: (row) => shortMoney(row.total) },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge value={row.estado} /> },
        ]}
      />
      <Modal open={Boolean(selected)} title="Detalle del pedido" onClose={() => setSelected(null)}>
        {selected && (
          <div className="detail-list">
            <p><b>Cliente:</b> {selected.cliente}</p>
            <p><b>Dirección:</b> {selected.direccionEnvio}</p>
            <p><b>Pago:</b> {selected.metodoPago} · {selected.pagado ? 'Pagado' : 'Pendiente'}</p>
            <p><b>Total:</b> {shortMoney(selected.total)} COP</p>
            <h3>Productos</h3>
            {(selected.productos || []).map((prod) => (
              <span key={`${prod.productoId}-${prod.nombre}`}>{prod.cantidad}x {prod.nombre}</span>
            ))}
          </div>
        )}
      </Modal>
    </section>
  )
}
