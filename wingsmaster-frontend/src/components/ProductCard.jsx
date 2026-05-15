import { Plus, Timer } from 'lucide-react'
import { shortMoney } from '../utils/formatters'
import { ActionButton } from './ActionButton'
import wingBox from '../assets/brand/wing-box.svg'

export function ProductCard({ prod, onAdd }) {
  return (
    <article className="product-card">
      <img
        src={prod.imagen || wingBox}
        alt={prod.nombre}
        onError={(e) => {
          e.currentTarget.src = wingBox
        }}
      />
      <div className="product-card-body">
        <div>
          <h3>{prod.nombre}</h3>
          <p>{prod.descripcion}</p>
        </div>
        <div className="product-card-foot">
          <div>
            <strong>{shortMoney(prod.precio)}</strong>
            <span>
              <Timer size={14} />
              {prod.tiempo || '25-35 min'}
            </span>
          </div>
          <ActionButton icon={Plus} size="sm" onClick={() => onAdd(prod)}>
            Agregar
          </ActionButton>
        </div>
      </div>
    </article>
  )
}
