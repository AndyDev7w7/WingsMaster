import { Eye, Pencil, Trash2 } from 'lucide-react'
import { cls } from '../utils/formatters'

export function DataTable({
  columns,
  rows,
  actions = true,
  empty = 'Sin datos por ahora',
  onView,
  onEdit,
  onDelete,
  renderActions,
}) {
  return (
    <div className="table-shell">
      <table className="wm-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-cell">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row._id || row.id || row.email} className={cls(row.highlight && 'row-highlight')}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {actions && (
                <td>
                  {renderActions ? (
                    renderActions(row)
                  ) : (
                    <div className="table-actions">
                      <button aria-label="Ver" onClick={() => onView?.(row)}>
                        <Eye size={18} />
                      </button>
                      <button aria-label="Editar" onClick={() => onEdit?.(row)}>
                        <Pencil size={18} />
                      </button>
                      <button aria-label="Eliminar" onClick={() => onDelete?.(row)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
