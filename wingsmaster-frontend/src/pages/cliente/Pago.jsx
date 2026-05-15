import { useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, Landmark } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { CartSummary } from '../../components/CartSummary'
import { useOrder } from '../../hooks/useOrder'
import { shortMoney } from '../../utils/formatters'

export function Pago() {
  const { payment, setPayment, total, cambio } = useOrder()
  const navigate = useNavigate()
  const Icon =
    payment.metodoPago === 'Transferencia bancaria'
      ? Landmark
      : payment.metodoPago === 'Tarjeta débito o crédito'
        ? CreditCard
        : Banknote

  return (
    <section className="checkout-grid">
      <CartSummary cta="Volver al pedido" to="/cliente/pedido" />
      <main className="checkout-main">
        <h1>Confirma tu método de pago</h1>
        <div className="pay-card">
          <Icon size={34} />
          <div>
            <h2>{payment.metodoPago}</h2>
            <p>Total a pagar: {shortMoney(total)} COP</p>
          </div>
        </div>

        {payment.metodoPago === 'Pago en efectivo' && (
          <label className="cash-input">
            ¿Con cuánto pagas?
            <input
              type="number"
              value={payment.recibido}
              onChange={(e) => setPayment({ ...payment, recibido: Number(e.target.value) })}
            />
          </label>
        )}

        {payment.metodoPago === 'Transferencia bancaria' && (
          <label className="cash-input">
            Referencia de transferencia
            <input
              value={payment.referencia || 'NEQUI-1045'}
              onChange={(e) => setPayment({ ...payment, referencia: e.target.value })}
            />
          </label>
        )}

        {payment.metodoPago === 'Tarjeta débito o crédito' && (
          <label className="cash-input">
            Últimos 4 dígitos
            <input
              value={payment.tarjeta || '4242'}
              maxLength={4}
              onChange={(e) => setPayment({ ...payment, tarjeta: e.target.value })}
            />
          </label>
        )}

        <div className="pay-summary">
          <span>Total</span>
          <strong>{shortMoney(total)} COP</strong>
          <span>Estado</span>
          <strong>Pago simulado listo</strong>
          <span>Cambio estimado</span>
          <strong>{shortMoney(cambio)} COP</strong>
        </div>
        <ActionButton onClick={() => navigate('/cliente/confirmacion')}>Ir a confirmación</ActionButton>
      </main>
    </section>
  )
}
