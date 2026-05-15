export function KpiCard({ item }) {
  const longValue = String(item.value).length > 6

  return (
    <article className={`kpi-card kpi-${item.tone || 'orange'}`}>
      <span>{item.label}</span>
      <strong className={longValue ? 'kpi-value-long' : ''}>{item.value}</strong>
    </article>
  )
}
