import { useCallback, useEffect, useMemo, useState } from 'react'
import { OrderContext } from './orderContext'
import { useAuth } from '../hooks/useAuth'
import { productosService } from '../services/productosService'
import wingBox from '../assets/brand/wing-box.svg'

const domicilio = 6000
const direccionDefault = {
  nombre: 'Casa',
  texto: 'Calle 10 #45-67',
  barrio: 'El Poblado, Medellín',
  detalle: 'Apartamento 501, portería principal',
}

const idProd = (prod) => prod?._id || prod?.id || prod?.productoId

const mapCarrito = (carrito) =>
  (carrito?.items || []).map((item) => {
    const prod = item.productoId || item

    return {
      ...prod,
      _id: idProd(prod),
      nombre: prod.nombre || item.nombre,
      precio: prod.precio || item.precioUnitario || 0,
      imagen: prod.imagen || wingBox,
      cantidad: item.cantidad || 1,
    }
  })

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [direccion, setDireccion] = useState(direccionDefault)
  const [payment, setPayment] = useState({
    metodoPago: 'Pago en efectivo',
    recibido: 52000,
  })
  const [lastOrder, setLastOrder] = useState(null)

  const userId = user?._id || user?.id

  const loadCart = useCallback(async () => {
    if (!userId || user?.role !== 'cliente') return

    setCartLoading(true)
    try {
      const carrito = await productosService.obtenerCarrito(userId)
      setCart(mapCarrito(carrito))
    } catch {
      setCart([])
    } finally {
      setCartLoading(false)
    }
  }, [userId, user?.role])

  const syncCart = useCallback(
    async (nextPromise) => {
      if (!userId) return

      try {
        const carrito = await nextPromise()
        setCart(mapCarrito(carrito))
      } catch {
        await loadCart()
      }
    },
    [loadCart, userId],
  )

  useEffect(() => {
    void Promise.resolve().then(loadCart)
  }, [loadCart])

  const addItem = useCallback(
    async (prod) => {
      await syncCart(
        () => productosService.agregarAlCarrito(userId, idProd(prod), 1),
      )
    },
    [syncCart, userId],
  )

  const updateQty = useCallback(
    async (id, delta) => {
      const current = cart.find((item) => item._id === id)
      const nextQty = Math.max(0, (current?.cantidad || 1) + delta)

      await syncCart(
        () => productosService.actualizarItemCarrito(userId, id, nextQty),
      )
    },
    [cart, syncCart, userId],
  )

  const removeItem = useCallback(
    async (id) => {
      await syncCart(
        () => productosService.eliminarDelCarrito(userId, id),
      )
    },
    [syncCart, userId],
  )

  const clearCart = useCallback(async () => {
    await syncCart(
      () => productosService.limpiarCarrito(userId),
    )
  }, [syncCart, userId])

  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const total = subtotal + domicilio
  const cambio = payment.metodoPago === 'Pago en efectivo' ? Math.max(0, payment.recibido - total) : 0

  const value = useMemo(
    () => ({
      cart,
      cartLoading,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      loadCart,
      subtotal,
      domicilio,
      total,
      direccion,
      setDireccion,
      payment,
      setPayment,
      cambio,
      lastOrder,
      setLastOrder,
    }),
    [
      cart,
      cartLoading,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      loadCart,
      subtotal,
      total,
      direccion,
      payment,
      cambio,
      lastOrder,
    ],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
