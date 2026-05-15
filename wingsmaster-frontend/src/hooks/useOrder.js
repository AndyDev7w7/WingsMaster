import { useContext } from 'react'
import { OrderContext } from '../context/orderContext'

export const useOrder = () => useContext(OrderContext)
