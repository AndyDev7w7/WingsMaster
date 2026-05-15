import { cls } from '../utils/formatters'

export function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  ...props
}) {
  return (
    <button className={cls('btn', `btn-${variant}`, `btn-${size}`, className)} {...props}>
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  )
}
