import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { CartSummary } from '../../components/CartSummary'
import { ActionButton } from '../../components/ActionButton'
import { useOrder } from '../../hooks/useOrder'

export function Carrito() {
  const { cart } = useOrder()
  const navigate = useNavigate()

  return (
    <section className="checkout-grid single">
      <div className="checkout-main">
        <h1>Carrito de compras</h1>
        <p className="muted">Revisa tus productos antes de elegir dirección y método de pago.</p>
        <CartSummary />
        {cart.length === 0 ? (
          <div className="empty-state">Tu carrito está vacío.</div>
        ) : (
          <ActionButton icon={ArrowRight} onClick={() => navigate('/cliente/pedido')}>
            Continuar al pedido
          </ActionButton>
        )}
      </div>
      <div className="checkout-aside">
        <ShoppingCart size={72} />
        <h2>Resumen listo</h2>
        <p>Los cambios de cantidad se hacen antes de confirmar. En confirmación será solo lectura.</p>
      </div>
    </section>
  )
}
