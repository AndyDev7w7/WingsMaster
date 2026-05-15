import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, MapPin, PackageCheck, Truck } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

export function DetalleEntrega() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const run = async () => {
      setPedido(await pedidosService.obtenerPedido(id))
    }

    run()
  }, [id])

  const setEstado = async (estado) => {
    const updated = await pedidosService.actualizarEstado(id, estado)
    setPedido((prev) => ({ ...prev, ...updated, estado }))
    setMsg(`Entrega marcada como ${estado}`)
  }

  const acciones = [
    ['Recogido', 'Recogido', PackageCheck],
    ['En camino', 'En camino', Truck],
    ['Entregado', 'Entregado', CheckCircle2],
  ]

  if (!pedido) return <section className="panel-page">Cargando entrega...</section>

  return (
    <section className="panel-page delivery-detail">
      <div className="page-head">
        <h1>Detalle de entrega</h1>
        <StatusBadge value={pedido.estado} />
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="delivery-detail-grid">
        <article className="delivery-card big">
          <strong>{pedido._id}</strong>
          <h2>{pedido.cliente}</h2>
          <p>
            <MapPin size={20} />
            {pedido.direccionEnvio}
          </p>
          <div className="order-lines">
            {(pedido.productos || []).map((prod) => (
              <span key={`${prod.productoId}-${prod.nombre}`}>
                {prod.cantidad}x {prod.nombre}
              </span>
            ))}
          </div>
          <h3>Total: {shortMoney(pedido.total)} COP</h3>
        </article>
        <aside className="driver-actions">
          <h2>Actualizar estado</h2>
          {acciones.map(([label, next, Icon]) => (
            <ActionButton key={label} icon={Icon} onClick={() => setEstado(next)}>
              Marcar {label.toLowerCase()}
            </ActionButton>
          ))}
        </aside>
      </div>
    </section>
  )
}
