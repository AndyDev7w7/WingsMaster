import { Minus, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../hooks/useOrder'
import { shortMoney } from '../utils/formatters'
import { ActionButton } from './ActionButton'
import wingBox from '../assets/brand/wing-box.svg'

export function CartSummary({
  readonly = false,
  cta = 'Ver carrito',
  to = '/cliente/carrito',
  itemsOverride,
  totalsOverride,
}) {
  const { cart, updateQty, removeItem, subtotal, domicilio, total } = useOrder()
  const navigate = useNavigate()
  const items = itemsOverride || cart
  const totals = totalsOverride || { subtotal, domicilio, total }

  return (
    <aside className="cart-panel">
      <h2>Mi Pedido</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={item.imagen || wingBox}
              alt={item.nombre}
              onError={(e) => {
                e.currentTarget.src = wingBox
              }}
            />
            <div>
              <div className="cart-line">
                <strong>{item.nombre}</strong>
                <b>{shortMoney((item.precio || item.precioUnitario || 0) * item.cantidad)}</b>
              </div>
              <span>{item.cantidad} unidad{item.cantidad > 1 ? 'es' : ''}</span>
              {!readonly && (
                <div className="qty-row">
                  <button onClick={() => updateQty(item._id, -1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => updateQty(item._id, 1)}>
                    <Plus size={16} />
                  </button>
                  <button onClick={() => removeItem(item._id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="total-box">
        <div>
          <span>Subtotal</span>
          <strong>{shortMoney(totals.subtotal)}</strong>
        </div>
        <div>
          <span>Domicilio</span>
          <strong>{shortMoney(totals.domicilio)}</strong>
        </div>
        <div className="grand-total">
          <span>Total</span>
          <strong>{shortMoney(totals.total)}</strong>
        </div>
      </div>
      {!readonly && (
        <ActionButton className="w-full justify-center" onClick={() => navigate(to)}>
          {cta}
        </ActionButton>
      )}
    </aside>
  )
}
