import { Search } from 'lucide-react'

export function SearchBox({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <label className="search-box">
      <Search size={20} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}

export function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="select-filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
