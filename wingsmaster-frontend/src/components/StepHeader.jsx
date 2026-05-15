import { Check } from 'lucide-react'
import { cls } from '../utils/formatters'

const steps = ['Mi Pedido', 'Método de Pago', 'Confirmación']

export function StepHeader({ current = 1 }) {
  return (
    <div className="step-header">
      {steps.map((step, idx) => {
        const num = idx + 1
        return (
          <div className={cls('step-item', num === current && 'active', num < current && 'done')} key={step}>
            <span>{num < current ? <Check size={18} /> : num}</span>
            <strong>{step}</strong>
          </div>
        )
      })}
    </div>
  )
}
