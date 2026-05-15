import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, CookingPot, Home, Truck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useOrder } from '../../hooks/useOrder'
import { pedidosService } from '../../services/pedidosService'

const flow = ['Pendiente', 'Preparando', 'En camino', 'Entregado']

export function Seguimiento() {
  const { user } = useAuth()
  const { lastOrder } = useOrder()
  const [pedido, setPedido] = useState(lastOrder)

  useEffect(() => {
    const run = async () => {
      if (lastOrder?._id) {
        setPedido(await pedidosService.obtenerPedido(lastOrder._id))
        return
      }

      const data = await pedidosService.listarPedidos(user?._id || user?.id)
      setPedido(data[0])
    }

    run()
  }, [lastOrder, user])

  const idx = flow.indexOf(pedido?.estado || 'Pendiente')
  const steps = useMemo(
    () => [
      { label: 'Pedido recibido', icon: CheckCircle2, done: idx >= 0 },
      { label: 'En preparación', icon: CookingPot, done: idx >= 1 },
      { label: 'En camino', icon: Truck, done: idx >= 2 },
      { label: 'Entregado', icon: Home, done: idx >= 3 },
    ],
    [idx],
  )

  return (
    <section className="client-page">
      <h1>Seguimiento de pedido</h1>
      {pedido && <p className="muted">Pedido {pedido._id} · estado actual: {pedido.estado}</p>}
      <div className="tracking-timeline">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <article className={step.done ? 'done' : ''} key={step.label}>
              <Icon size={32} />
              <strong>{step.label}</strong>
              <span>{step.done ? 'Completado' : 'Pendiente'}</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
