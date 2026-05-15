import { useEffect, useState } from 'react'
import { CheckCircle2, CookingPot, Eye, PackageCheck } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { Modal } from '../../components/Modal'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

const flow = ['Pendiente', 'Preparando', 'Listo', 'En camino', 'Entregado']

export function PedidosEmpleado() {
  const [ordenes, setOrdenes] = useState([])
  const [selected, setSelected] = useState(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const data = await pedidosService.listarPedidos()
    setOrdenes(data.filter((pedido) => !['Entregado', 'Cancelado'].includes(pedido.estado)))
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  const nextState = (pedido) => {
    const idx = flow.indexOf(pedido.estado)
    return flow[Math.min(idx + 1, flow.length - 1)]
  }

  const advance = async (pedido) => {
    const next = nextState(pedido)
    await pedidosService.actualizarEstado(pedido._id, next)
    setMsg(`Pedido ${pedido._id} pasó a ${next}`)
    await load()
  }

  const groups = [
    { label: 'Pendientes', estado: 'Pendiente', icon: PackageCheck },
    { label: 'En preparación', estado: 'Preparando', icon: CookingPot },
    { label: 'Listos / ruta', estado: 'Listo', icon: CheckCircle2 },
  ]

  return (
    <section className="panel-page ops-page">
      <div className="page-head">
        <h1>Gestión de Pedidos del Empleado</h1>
        <p>Cola operativa para cocina, mostrador y despacho.</p>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="ops-grid">
        {groups.map((group) => {
          const Icon = group.icon
          const items = ordenes.filter((pedido) => pedido.estado === group.estado)
          return (
            <article className="ops-column" key={group.estado}>
              <h2>
                <Icon size={22} />
                {group.label}
                <span>{items.length}</span>
              </h2>
              {items.map((pedido) => (
                <div className="ops-ticket" key={pedido._id}>
                  <div>
                    <strong>{pedido._id}</strong>
                    <StatusBadge value={pedido.estado} />
                  </div>
                  <h3>{pedido.cliente}</h3>
                  <p>{(pedido.productos || []).map((prod) => `${prod.cantidad}x ${prod.nombre}`).join(', ')}</p>
                  <small>{pedido.tipo} · {shortMoney(pedido.total)}</small>
                  <div className="ticket-actions">
                    <button onClick={() => setSelected(pedido)}><Eye size={18} /></button>
                    <ActionButton size="sm" icon={CheckCircle2} onClick={() => advance(pedido)}>
                      Avanzar estado
                    </ActionButton>
                  </div>
                </div>
              ))}
            </article>
          )
        })}
      </div>
      <Modal open={Boolean(selected)} title="Detalle operativo" onClose={() => setSelected(null)}>
        {selected && (
          <div className="detail-list">
            <p><b>Cliente:</b> {selected.cliente}</p>
            <p><b>Dirección:</b> {selected.direccionEnvio}</p>
            <p><b>Total:</b> {shortMoney(selected.total)} COP</p>
            {(selected.productos || []).map((prod) => <span key={prod.nombre}>{prod.cantidad}x {prod.nombre}</span>)}
          </div>
        )}
      </Modal>
    </section>
  )
}
