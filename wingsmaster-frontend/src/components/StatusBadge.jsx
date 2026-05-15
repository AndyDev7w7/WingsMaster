import { CheckCircle2, Clock3, Loader2, Truck, XCircle } from 'lucide-react'
import { cls, estadoTone } from '../utils/formatters'

const icons = {
  success: CheckCircle2,
  warning: Clock3,
  info: Loader2,
  sky: Truck,
  danger: XCircle,
  neutral: Clock3,
}

export function StatusBadge({ value, tone }) {
  const finalTone = tone || estadoTone(value)
  const Icon = icons[finalTone] || Clock3

  return (
    <span className={cls('status-badge', `status-${finalTone}`)}>
      <Icon size={14} />
      {value}
    </span>
  )
}
