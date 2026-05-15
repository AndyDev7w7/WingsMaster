import { Navigate, Route, Routes } from 'react-router-dom'
import { BackofficeLayout } from './layouts/BackofficeLayout'
import { CheckoutLayout } from './layouts/CheckoutLayout'
import { ClientLayout } from './layouts/ClientLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Dashboard } from './pages/admin/Dashboard'
import { InventarioAdmin } from './pages/admin/InventarioAdmin'
import { PagosAdmin } from './pages/admin/PagosAdmin'
import { PedidosAdmin } from './pages/admin/PedidosAdmin'
import { ProductosAdmin } from './pages/admin/ProductosAdmin'
import { UsuariosAdmin } from './pages/admin/UsuariosAdmin'
import { Carrito } from './pages/cliente/Carrito'
import { Catalogo } from './pages/cliente/Catalogo'
import { Confirmacion } from './pages/cliente/Confirmacion'
import { Historial } from './pages/cliente/Historial'
import { Pago } from './pages/cliente/Pago'
import { Pedido } from './pages/cliente/Pedido'
import { Seguimiento } from './pages/cliente/Seguimiento'
import { InventarioEmpleado } from './pages/empleado/InventarioEmpleado'
import { PagosEmpleado } from './pages/empleado/PagosEmpleado'
import { PedidosEmpleado } from './pages/empleado/PedidosEmpleado'
import { ProductosEmpleado } from './pages/empleado/ProductosEmpleado'
import { RegistrarPagoLocal } from './pages/empleado/RegistrarPagoLocal'
import { Home } from './pages/public/Home'
import { Login } from './pages/public/Login'
import { Register } from './pages/public/Register'
import { DetalleEntrega } from './pages/repartidor/DetalleEntrega'
import { Entregas } from './pages/repartidor/Entregas'
import { Cuenta } from './pages/shared/Cuenta'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      <Route element={<ProtectedRoute roles={['cliente']} />}>
        <Route path="/cliente" element={<ClientLayout />}>
          <Route index element={<Navigate to="/cliente/catalogo" replace />} />
          <Route path="perfil" element={<Cuenta />} />
          <Route path="cuenta" element={<Cuenta />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="historial" element={<Historial />} />
        </Route>
        <Route path="/cliente/pedido" element={<CheckoutLayout step={1} />}>
          <Route index element={<Pedido />} />
        </Route>
        <Route path="/cliente/pago" element={<CheckoutLayout step={2} />}>
          <Route index element={<Pago />} />
        </Route>
        <Route path="/cliente/confirmacion" element={<CheckoutLayout step={3} />}>
          <Route index element={<Confirmacion />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['administrador']} />}>
        <Route path="/admin" element={<BackofficeLayout role="administrador" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reportes" element={<Dashboard />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="inventario" element={<InventarioAdmin />} />
          <Route path="pagos" element={<PagosAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="cuenta" element={<Cuenta />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['empleado']} />}>
        <Route path="/empleado" element={<BackofficeLayout role="empleado" title="Operación de hoy" />}>
          <Route index element={<Navigate to="/empleado/pedidos" replace />} />
          <Route path="productos" element={<ProductosEmpleado />} />
          <Route path="inventario" element={<InventarioEmpleado />} />
          <Route path="pedidos" element={<PedidosEmpleado />} />
          <Route path="registrar-pago" element={<RegistrarPagoLocal />} />
          <Route path="pagos" element={<PagosEmpleado />} />
          <Route path="cuenta" element={<Cuenta />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['repartidor']} />}>
        <Route path="/repartidor" element={<BackofficeLayout role="repartidor" title="Ruta activa" />}>
          <Route index element={<Navigate to="/repartidor/entregas" replace />} />
          <Route path="entregas" element={<Entregas />} />
          <Route path="asignados" element={<Entregas />} />
          <Route path="pedido/:id" element={<DetalleEntrega />} />
          <Route path="cuenta" element={<Cuenta />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
