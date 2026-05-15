import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, CheckCircle2, CreditCard, Home, Landmark, MapPin, Plus, Save } from 'lucide-react'
import { CartSummary } from '../../components/CartSummary'
import { ActionButton } from '../../components/ActionButton'
import { useOrder } from '../../hooks/useOrder'
import { shortMoney } from '../../utils/formatters'
import mapImg from '../../assets/brand/map-medellin.svg'

const metodos = [
  {
    id: 'Pago en efectivo',
    label: 'Pago en efectivo',
    desc: 'Pagas al recibir. Calculamos el cambio estimado.',
    icon: Banknote,
  },
  {
    id: 'Transferencia bancaria',
    label: 'Transferencia bancaria',
    desc: 'Simula una referencia Bancolombia o Nequi.',
    icon: Landmark,
  },
  {
    id: 'Tarjeta débito o crédito',
    label: 'Tarjeta débito o crédito',
    desc: 'Pago simulado con últimos dígitos de tarjeta.',
    icon: CreditCard,
  },
]

const baseAddresses = [
  {
    nombre: 'Casa',
    texto: 'Calle 10 #45-67',
    barrio: 'El Poblado, Medellín',
    detalle: 'Apartamento 501, portería principal',
  },
  {
    nombre: 'Trabajo',
    texto: 'Cra. 43A #16-20',
    barrio: 'Ciudad del Río, Medellín',
    detalle: 'Recepción torre sur',
  },
]

export function Pedido() {
  const { direccion, setDireccion, payment, setPayment, subtotal, domicilio, total, cambio } = useOrder()
  const [addresses, setAddresses] = useState(baseAddresses)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...direccion })
  const navigate = useNavigate()

  const currentMethod = useMemo(
    () => metodos.find((item) => item.id === payment.metodoPago) || metodos[0],
    [payment.metodoPago],
  )
  const CurrentIcon = currentMethod.icon

  const selectAddress = (addr) => {
    setDireccion(addr)
    setDraft(addr)
    setEditing(false)
  }

  const saveAddress = () => {
    const next = {
      nombre: draft.nombre || 'Nueva dirección',
      texto: draft.texto,
      barrio: draft.barrio,
      detalle: draft.detalle,
    }
    setAddresses((items) => [next, ...items.filter((item) => item.texto !== next.texto)])
    setDireccion(next)
    setEditing(false)
  }

  return (
    <section className="checkout-grid order-screen">
      <CartSummary cta="Continuar" to="/cliente/pago" />
      <main className="checkout-main order-main">
        <div className="order-title">
          <div>
            <h1>Selecciona tu dirección de entrega</h1>
            <p>Elige una dirección guardada o agrega una nueva para este pedido.</p>
          </div>
          <button onClick={() => setEditing(true)}>
            <Plus size={18} />
            Nueva dirección
          </button>
        </div>

        <div className="address-grid">
          {addresses.map((addr) => (
            <button
              className={`address-option ${direccion.texto === addr.texto ? 'active' : ''}`}
              key={addr.texto}
              onClick={() => selectAddress(addr)}
            >
              <MapPin size={22} />
              <span>{addr.nombre}</span>
              <strong>{addr.texto}</strong>
              <small>{addr.barrio}</small>
              <em>{addr.detalle}</em>
            </button>
          ))}
        </div>

        {editing && (
          <article className="address-editor">
            <h2>Editar dirección</h2>
            <div className="form-grid">
              <label>Nombre<input value={draft.nombre || ''} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} /></label>
              <label>Dirección<input value={draft.texto || ''} onChange={(e) => setDraft({ ...draft, texto: e.target.value })} /></label>
              <label>Barrio / ciudad<input value={draft.barrio || ''} onChange={(e) => setDraft({ ...draft, barrio: e.target.value })} /></label>
              <label>Detalle<input value={draft.detalle || ''} onChange={(e) => setDraft({ ...draft, detalle: e.target.value })} /></label>
            </div>
            <ActionButton icon={Save} onClick={saveAddress}>Guardar dirección</ActionButton>
          </article>
        )}

        <div className="delivery-map">
          <img src={mapImg} alt="Mapa de entrega en Medellín" />
          <div>
            <Home size={22} />
            <strong>{direccion.texto}</strong>
            <span>{direccion.barrio}</span>
          </div>
        </div>

        <h2>Método de pago</h2>
        <div className="method-grid">
          {metodos.map((method) => {
            const Icon = method.icon
            return (
              <button
                className={payment.metodoPago === method.id ? 'active' : ''}
                onClick={() => setPayment({ ...payment, metodoPago: method.id })}
                key={method.id}
              >
                <Icon size={24} />
                <span>{method.label}</span>
                <small>{method.desc}</small>
              </button>
            )
          })}
        </div>

        <article className="method-detail">
          <CurrentIcon size={28} />
          <div>
            <h3>{currentMethod.label}</h3>
            {payment.metodoPago === 'Pago en efectivo' && (
              <label>
                ¿Con cuánto pagas?
                <input
                  type="number"
                  value={payment.recibido}
                  onChange={(e) => setPayment({ ...payment, recibido: Number(e.target.value) })}
                />
              </label>
            )}
            {payment.metodoPago === 'Transferencia bancaria' && (
              <label>
                Referencia simulada
                <input
                  value={payment.referencia || 'NEQUI-1045'}
                  onChange={(e) => setPayment({ ...payment, referencia: e.target.value })}
                />
              </label>
            )}
            {payment.metodoPago === 'Tarjeta débito o crédito' && (
              <label>
                Últimos 4 dígitos
                <input
                  value={payment.tarjeta || '4242'}
                  maxLength={4}
                  onChange={(e) => setPayment({ ...payment, tarjeta: e.target.value })}
                />
              </label>
            )}
          </div>
        </article>
      </main>

      <aside className="checkout-aside order-summary">
        <h2>Resumen</h2>
        <div className="summary-address">
          <CheckCircle2 size={20} />
          <div>
            <strong>{direccion.texto}</strong>
            <span>{direccion.barrio}</span>
          </div>
        </div>
        <div className="summary-method">
          <CurrentIcon size={22} />
          <div>
            <strong>{currentMethod.label}</strong>
            <span>{payment.metodoPago === 'Pago en efectivo' ? `Cambio: ${shortMoney(cambio)}` : 'Pago simulado listo'}</span>
          </div>
        </div>
        <div className="summary-lines">
          <p><span>Subtotal</span><b>{shortMoney(subtotal)} COP</b></p>
          <p><span>Domicilio</span><b>{shortMoney(domicilio)} COP</b></p>
          <p className="big"><span>Total</span><b>{shortMoney(total)} COP</b></p>
        </div>
        <ActionButton className="w-full justify-center" onClick={() => navigate('/cliente/pago')}>
          Continuar al pago
        </ActionButton>
      </aside>
    </section>
  )
}
