import { Outlet } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { StepHeader } from '../components/StepHeader'

export function CheckoutLayout({ step = 1 }) {
  return (
    <div className="app-frame checkout-frame">
      <TopBar mode="cliente" />
      <StepHeader current={step} />
      <Outlet />
    </div>
  )
}
