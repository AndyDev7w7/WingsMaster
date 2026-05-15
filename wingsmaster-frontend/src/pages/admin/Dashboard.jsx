import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CreditCard, Eye, RefreshCw } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { KpiCard } from '../../components/KpiCard'
import { MiniChart } from '../../components/MiniChart'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { reportesService } from '../../services/reportesService'
import { money, shortMoney } from '../../utils/formatters'
import wingBox from '../../assets/brand/wing-box.svg'

const imgProd = (nombre = '') => {
  const txt = nombre.toLowerCase()
  if (txt.includes('x6')) return '/productos/alitas-bbq-x6-real.png'
  if (txt.includes('familiar')) return '/productos/combo-familiar-real.png'
  if (txt.includes('fiesta')) return '/productos/combo-fiesta-real.png'
  if (txt.includes('duo')) return '/productos/combo-krunchy-duo-real.png'
  if (txt.includes('dos')) return '/productos/combo-dos-real.png'
  if (txt.includes('combo')) return '/productos/combo-clasico-real.png'
  if (txt.includes('alita')) return '/productos/alitas-bbq-real.png'
  if (txt.includes('papa')) return '/productos/papas-criollas-real.png'
  if (txt.includes('salsa')) return '/productos/salsa-miel-mostaza-real.png'
  if (txt.includes('bebida') || txt.includes('limonada') || txt.includes('sprite') || txt.includes('pepsi')) {
    return '/productos/limonada-natural-real.png'
  }

  return wingBox
}

const fechaCorta = (value) => {
  if (!value) return 'Hoy'
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

export function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const next = await reportesService.dashboard()
      setData(next)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadDashboard)
  }, [])

  const kpis = useMemo(() => {
    const info = data?.kpis || {}
    return [
      { label: 'Pedidos Totales', value: String(info.pedidosTotales || 0), tone: 'orange' },
      { label: 'Ventas Totales', value: shortMoney(info.ventasTotales || 0), tone: 'red' },
      { label: 'Pedidos Entregados', value: String(info.pedidosEntregados || 0), tone: 'green' },
      { label: 'Pedidos Pendientes', value: String(info.pedidosPendientes || 0), tone: 'gold' },
    ]
  }, [data])

  const ventas = data?.ventasPorDia || []
  const chartValues = ventas.length ? ventas.map((item) => item.facturas || 0) : [0]
  const chartLabels = ventas.length ? ventas.map((item) => fechaCorta(item._id)) : ['sin ventas']
  const productosTop = data?.productosTop || []
  const pagosMetodo = data?.pagosMetodo || []
  const pedidosRecientes = data?.pedidosRecientes || []

  return (
    <section className="dashboard-grid">
      <div className="dashboard-main">
        <div className="page-head">
          <div>
            <h1>Dashboard y Reportes</h1>
            <p>Datos reales tomados de pedidos y facturas en MongoDB Atlas.</p>
          </div>
          <div className="head-actions">
            <button onClick={loadDashboard} disabled={loading}>
              <RefreshCw size={17} />
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {error && <Notice type="error">{error}</Notice>}

        <div className="kpi-grid">
          {kpis.map((item) => (
            <KpiCard item={item} key={item.label} />
          ))}
        </div>

        <article className="chart-card">
          <div className="chart-head">
            <div>
              <h2>Ventas Registradas</h2>
              <p>Facturas completadas por día</p>
            </div>
            <strong>{data?.kpis?.totalFacturas || 0} facturas</strong>
          </div>
          <MiniChart values={chartValues} labels={chartLabels} />
        </article>

        <DataTable
          rows={pedidosRecientes}
          empty={loading ? 'Cargando pedidos...' : 'Todavía no hay pedidos registrados'}
          columns={[
            {
              key: 'cliente',
              label: 'Pedidos recientes',
              render: (row) => (
                <div>
                  <strong>{row.cliente || 'Cliente Krunchy'}</strong>
                  <span className="subtle-row">{row.direccionEnvio || row.tipo || 'Sin dirección'}</span>
                </div>
              ),
            },
            { key: 'total', label: 'Total', render: (row) => money(row.total) },
            { key: 'estado', label: 'Estado', render: (row) => <StatusBadge value={row.estado} /> },
          ]}
          renderActions={(row) => (
            <div className="table-actions">
              <button aria-label="Ver pedido" onClick={() => navigate('/admin/pedidos', { state: { pedidoId: row._id } })}>
                <Eye size={18} />
              </button>
              <button aria-label="Actualizar pedido" onClick={() => navigate('/admin/pedidos')}>
                <Check size={18} />
              </button>
              <button aria-label="Ver pagos" onClick={() => navigate('/admin/pagos')}>
                <CreditCard size={18} />
              </button>
            </div>
          )}
        />
      </div>

      <aside className="report-side">
        <h2>Productos Destacados</h2>
        {productosTop.length === 0 && <p className="muted">Aún no hay ventas por producto.</p>}
        {productosTop.map((prod) => (
          <div className="top-product" key={prod._id || prod.nombre}>
            <img
              src={imgProd(prod.nombre)}
              alt={prod.nombre || 'Producto'}
              onError={(e) => {
                e.currentTarget.src = wingBox
              }}
            />
            <div>
              <strong>{prod.nombre || 'Producto'}</strong>
              <span>{prod.unidades || 0} unidades</span>
              <small>{money(prod.ventas || 0)}</small>
            </div>
          </div>
        ))}

        <div className="donut-card">
          <h2>Resumen de Pagos</h2>
          <div className="donut">{data?.kpis?.totalFacturas || 0}<br />facturas</div>
          {pagosMetodo.length === 0 && <p className="muted">Sin pagos registrados.</p>}
          {pagosMetodo.map((item) => (
            <button className="pay-row" key={item._id || 'sin-metodo'} onClick={() => navigate('/admin/pagos')}>
              <span>{item._id || 'Sin método'}</span>
              <b>{item.total || 0}</b>
            </button>
          ))}
        </div>

        <div className="table-actions large-actions">
          <button aria-label="Ir a productos" onClick={() => navigate('/admin/productos')}>
            <Eye size={18} />
          </button>
          <button aria-label="Ir a pedidos" onClick={() => navigate('/admin/pedidos')}>
            <Check size={18} />
          </button>
          <button aria-label="Ir a pagos" onClick={() => navigate('/admin/pagos')}>
            <CreditCard size={18} />
          </button>
        </div>
      </aside>
    </section>
  )
}
