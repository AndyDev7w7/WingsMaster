import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, ReceiptText, Search } from 'lucide-react'
import { ActionButton } from '../../components/ActionButton'
import { Notice } from '../../components/Notice'
import { StatusBadge } from '../../components/StatusBadge'
import { pagosService } from '../../services/pagosService'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

export function RegistrarPagoLocal() {
  const [pedidos, setPedidos] = useState([])
  const [pedidoId, setPedidoId] = useState('')
  const [metodo, setMetodo] = useState('Pago en efectivo')
  const [recibido, setRecibido] = useState(52000)
  const [done, setDone] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const run = async () => {
      const data = await pedidosService.listarPedidos()
      setPedidos(data)
      setPedidoId(data[0]?._id || '')
    }

    run()
  }, [])

  const pedido = useMemo(
    () => pedidos.find((item) => item._id.toLowerCase().includes(pedidoId.toLowerCase())) || pedidos[0],
    [pedidoId, pedidos],
  )
  const cambio = metodo === 'Pago en efectivo' ? Math.max(0, recibido - (pedido?.total || 0)) : 0

  const confirmar = async () => {
    if (!pedido) return
    await pagosService.generarFactura({
      pedidoId: pedido._id,
      cliente: pedido.cliente,
      monto: pedido.total,
      metodoPago: metodo,
      estado: 'Completado',
    })
    setDone(true)
    setMsg('Pago registrado y factura generada')
  }

  return (
    <section className="panel-page local-pay-page">
      <div className="page-head">
        <h1>Registrar Pago en Local</h1>
        <p>Busca el pedido, confirma el monto recibido y marca el pago como completado.</p>
      </div>
      <Notice type="success">{msg}</Notice>
      <div className="local-pay-grid">
        <article className="pay-form-card">
          <label className="search-box wide">
            <Search size={20} />
            <input value={pedidoId} onChange={(e) => setPedidoId(e.target.value)} placeholder="Buscar pedido..." />
          </label>
          {pedido && (
            <div className="found-order">
              <h2>{pedido._id}</h2>
              <StatusBadge value={done ? 'Pagado' : 'Pendiente'} />
              <p>{pedido.cliente}</p>
              <strong>{shortMoney(pedido.total)} COP</strong>
            </div>
          )}
          <label>
            Método de pago presencial
            <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
              <option>Pago en efectivo</option>
              <option>Transferencia bancaria</option>
              <option>Tarjeta</option>
            </select>
          </label>
          {metodo === 'Pago en efectivo' && (
            <label>
              Valor recibido
              <input type="number" value={recibido} onChange={(e) => setRecibido(Number(e.target.value))} />
            </label>
          )}
          <div className="change-box">
            <span>Cambio</span>
            <strong>{shortMoney(cambio)} COP</strong>
          </div>
          <ActionButton icon={BadgeCheck} onClick={confirmar}>
            Confirmar pago
          </ActionButton>
        </article>
        <aside className="receipt-card">
          <ReceiptText size={46} />
          <h2>Comprobante</h2>
          <p>Pedido: {pedido?._id || 'Sin pedido'}</p>
          <p>Cliente: {pedido?.cliente || '-'}</p>
          <p>Método: {metodo}</p>
          <strong>Total: {shortMoney(pedido?.total || 0)} COP</strong>
          {done && <StatusBadge value="Completado" />}
        </aside>
      </div>
    </section>
  )
}
