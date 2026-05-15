import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, PackageCheck, Truck } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { StatusBadge } from '../../components/StatusBadge'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

export function Entregas() {
  const [asignados, setAsignados] = useState([])

  const load = async () => {
    const data = await pedidosService.listarPedidos()
    setAsignados(data.filter((pedido) => pedido.tipo === 'Domicilio' && pedido.estado !== 'Entregado'))
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  return (
    <section className="panel-page delivery-page">
      <div className="page-head">
        <h1>Pedidos Asignados y Entregas</h1>
        <p>Vista operativa para marcar recogido, en camino y entregado.</p>
      </div>
      <div className="delivery-list">
        {asignados.map((pedido) => (
          <article className="delivery-card" key={pedido._id}>
            <div className="delivery-top">
              <div>
                <strong>{pedido._id}</strong>
                <span>{pedido.cliente}</span>
              </div>
              <StatusBadge value={pedido.estado} />
            </div>
            <p>
              <MapPin size={18} />
              {pedido.direccionEnvio}
            </p>
            <p>
              <Truck size={18} />
              Repartidor: {pedido.repartidor || 'Turno actual'}
            </p>
            <div className="delivery-foot">
              <strong>{shortMoney(pedido.total)} COP</strong>
              <Link to={`/repartidor/pedido/${pedido._id}`}>
                <ActionButton size="sm" icon={PackageCheck}>
                  Ver detalle
                </ActionButton>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
