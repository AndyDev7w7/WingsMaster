import { useEffect, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { pedidosService } from '../../services/pedidosService'
import { shortMoney } from '../../utils/formatters'

export function Historial() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])

  useEffect(() => {
    const run = async () => {
      const data = await pedidosService.listarPedidos(user?._id || user?.id)
      setRows(data)
    }

    run()
  }, [user])

  return (
    <section className="client-page">
      <h1>Historial de compras</h1>
      <DataTable
        rows={rows}
        actions={false}
        columns={[
          { key: '_id', label: 'Pedido' },
          { key: 'fecha', label: 'Fecha', render: (row) => new Date(row.createdAt || Date.now()).toLocaleDateString('es-CO') },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge value={row.estado} /> },
          { key: 'total', label: 'Total', render: (row) => shortMoney(row.total) },
        ]}
      />
    </section>
  )
}
