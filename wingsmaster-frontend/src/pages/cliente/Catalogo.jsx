import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, PackageCheck, Truck } from 'lucide-react'
import { CartSummary } from '../../components/CartSummary'
import { ProductCard } from '../../components/ProductCard'
import { SearchBox } from '../../components/Filters'
import { Notice } from '../../components/Notice'
import { useOrder } from '../../hooks/useOrder'
import { productosService } from '../../services/productosService'
import wingBox from '../../assets/brand/wing-box.svg'

const catsBase = ['Alitas', 'Combos', 'Acompañantes', 'Bebidas', 'Salsas', 'Promociones']

export function Catalogo() {
  const [categoria, setCategoria] = useState('Combos')
  const [search, setSearch] = useState('')
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const { addItem, direccion } = useOrder()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const urlSearch = params.get('buscar') || ''
  const visibleSearch = urlSearch || search
  const activeCategory = urlSearch ? 'Todos' : categoria

  useEffect(() => {
    const run = async () => {
      try {
        const data = await productosService.listarProductos()
        setProductos(data.map((prod) => ({ ...prod, imagen: prod.imagen || wingBox })))
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const categorias = useMemo(() => {
    const cats = new Set(['Todos', ...catsBase, ...productos.map((prod) => prod.categoria).filter(Boolean)])
    return [...cats]
  }, [productos])

  const filtered = useMemo(
    () =>
      productos.filter((prod) => {
        const byCategory = activeCategory === 'Todos' || prod.categoria === activeCategory
        const bySearch = prod.nombre.toLowerCase().includes(visibleSearch.toLowerCase())
        return byCategory && bySearch && prod.disponible !== false
      }),
    [activeCategory, visibleSearch, productos],
  )

  const addProd = async (prod) => {
    await addItem(prod)
    setNotice(`${prod.nombre} agregado al carrito`)
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <section className="catalog-grid">
      <aside className="client-side">
        <nav className="category-list">
          {categorias.map((cat) => (
            <button
              className={cat === activeCategory ? 'active' : ''}
              key={cat}
              onClick={() => {
                if (urlSearch) navigate('/cliente/catalogo')
                setSearch('')
                setCategoria(cat)
              }}
            >
              {cat}
            </button>
          ))}
        </nav>
        <div className="address-card">
          <span>Domicilio</span>
          <strong>{direccion.texto}, Medellín</strong>
          <button onClick={() => navigate('/cliente/pedido')}>Cambiar</button>
        </div>
        <div className="tracking-card">
          <h3>Seguimiento de Pedido</h3>
          <p><PackageCheck size={16} /> En preparación</p>
          <p><Truck size={16} /> En camino</p>
          <p><MapPin size={16} /> Entregado</p>
        </div>
      </aside>
      <main className="catalog-main">
        <Notice type="success">{notice}</Notice>
        <div className="hero-banner">
          <div>
            <h1>Bienvenido a WingsMaster</h1>
            <p>Pide tus alitas favoritas</p>
            <button onClick={() => navigate('/cliente/carrito')}>Ordenar ahora</button>
          </div>
          <img src="/productos/combo-fiesta-real.png" alt="Combo de alitas" />
        </div>
        <div className="catalog-toolbar">
          <h2>{activeCategory === 'Todos' ? 'Productos destacados' : `${activeCategory} destacados`}</h2>
          <SearchBox
            value={visibleSearch}
            onChange={(value) => {
              if (urlSearch) navigate('/cliente/catalogo')
              setSearch(value)
            }}
            placeholder="Buscar producto..."
          />
        </div>
        {loading ? (
          <div className="empty-state">Cargando catálogo...</div>
        ) : (
          <div className="product-grid">
            {filtered.map((prod) => (
              <ProductCard prod={prod} onAdd={addProd} key={prod._id} />
            ))}
          </div>
        )}
      </main>
      <CartSummary />
    </section>
  )
}
