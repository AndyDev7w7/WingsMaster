import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import conectarDB from './config/db.js'
import carritoRoutes from './routes/carritoRoutes.js'
import productoRoutes from './routes/productoRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/api/productos', productoRoutes)
app.use('/api/carrito', carritoRoutes)

app.get('/', (req, res) => {
  res.json({ msg: 'MS Productos vivo' })
})

conectarDB()

app.listen(PORT, () => {
  console.log(`MS Productos corriendo en puerto ${PORT}`)
})
