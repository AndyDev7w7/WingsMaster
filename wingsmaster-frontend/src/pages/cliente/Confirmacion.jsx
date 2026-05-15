import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Truck } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { CartSummary } from '../../components/CartSummary'
import { Notice } from '../../components/Notice'
import { useAuth } from '../../hooks/useAuth'
import { useOrder } from '../../hooks/useOrder'
import { pagosService } from '../../services/pagosService'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

export function Confirmacion() {
  const { user } = useAuth()
  const { cart, clearCart, direccion, payment, subtotal, domicilio, total, lastOrder, setLastOrder } = useOrder()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const snapshot = lastOrder?.items || cart
  const totals = lastOrder?.totals || { subtotal, domicilio, total }
  const done = Boolean(lastOrder?._id)
  const pagoEstimado =
    payment.metodoPago === 'Pago en efectivo'
      ? Math.max(Number(payment.recibido || 0), totals.total)
      : totals.total
  const cambioFinal =
    payment.metodoPago === 'Pago en efectivo'
      ? Math.max(0, pagoEstimado - totals.total)
      : 0

  const productosPedido = useMemo(
    () =>
      cart.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
    [cart],
  )

  const confirmar = async () => {
    if (!cart.length) {
      setErr('Tu carrito está vacío.')
      return
    }

    setLoading(true)
    setErr('')

    try {
      const pedido = await pedidosService.crearPedido({
        usuarioId: user?._id || user?.id,
        cliente: user?.nombre || user?.username || user?.email,
        productos: productosPedido,
        total,
        direccionEnvio: `${direccion.texto}, ${direccion.barrio}`,
        metodoPago: payment.metodoPago,
        tipo: 'Domicilio',
      })

      const pagoResp = await pagosService.procesarPago({
        pedidoId: pedido._id,
        usuarioId: user?._id || user?.id,
        cliente: user?.nombre || user?.username || user?.email,
        monto: total,
        metodoPago: payment.metodoPago,
      })

      setLastOrder({
        ...pedido,
        pago: pagoResp?.pago,
        items: cart,
        totals: { subtotal, domicilio, total },
      })
      await clearCart()
    } catch (error) {
      setErr(error.message || 'No se pudo confirmar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="checkout-grid">
      <CartSummary readonly itemsOverride={snapshot} totalsOverride={totals} />
      <main className="confirm-main">
        <h1>Confirma tu pedido</h1>
        <Notice type="danger">{err}</Notice>
        <div className="confirm-card">
          <CheckCircle2 />
          <div>
            <h2>{direccion.texto}, {direccion.barrio}</h2>
            <p>Tiempo estimado: 25-35 minutos</p>
          </div>
        </div>
        <div className="confirm-card">
          <CheckCircle2 />
          <div>
            <h2>{payment.metodoPago}</h2>
            <p>
              Pagas: {shortMoney(pagoEstimado)} COP. Cambio: {shortMoney(cambioFinal)} COP
            </p>
          </div>
        </div>
        <div className="ready-card">
          <Truck size={72} />
          <div>
            <h2>{done ? 'Tu pedido está listo' : 'Resumen listo para enviar'}</h2>
            <p>
              {done
                ? `Pedido ${lastOrder._id} creado y pago registrado.`
                : `Total a pagar: ${shortMoney(totals.total)} COP.`}
            </p>
            {done ? (
              <ActionButton onClick={() => navigate('/cliente/seguimiento')}>Seguir pedido</ActionButton>
            ) : (
              <ActionButton onClick={confirmar} disabled={loading}>
                {loading ? 'Confirmando...' : 'Confirmar y enviar pedido'}
              </ActionButton>
            )}
          </div>
        </div>
      </main>
      <aside className="checkout-aside red-total">
        <h2>Resumen del Pedido</h2>
        <p>Dirección de entrega</p>
        <strong>{direccion.texto}</strong>
        <p>Método de pago</p>
        <strong>{payment.metodoPago}</strong>
        <div className="grand-total">
          <span>Total</span>
          <strong>{shortMoney(totals.total)} COP</strong>
        </div>
      </aside>
    </section>
  )
}
