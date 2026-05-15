export function MiniChart({ values = [], labels = [] }) {
  const cleanValues = values.length ? values : [0]
  const max = Math.max(...cleanValues, 1)
  const step = cleanValues.length > 1 ? 586 / (cleanValues.length - 1) : 0
  const points = cleanValues
    .map((value, idx) => {
      const x = 32 + idx * step
      const y = 190 - (value / max) * 150
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg className="mini-chart" viewBox="0 0 650 220" role="img" aria-label="Pedidos realizados">
      {[0, 1, 2, 3, 4].map((line) => (
        <line key={line} x1="20" x2="630" y1={35 + line * 38} y2={35 + line * 38} />
      ))}
      <polyline points={points} />
      {cleanValues.map((value, idx) => (
        <circle key={`${value}-${idx}`} cx={32 + idx * step} cy={190 - (value / max) * 150} r="6" />
      ))}
      {cleanValues.map((_, idx) => (
        <text key={idx} x={20 + idx * step} y="212">
          {labels[idx] || `día ${idx + 1}`}
        </text>
      ))}
    </svg>
  )
}
