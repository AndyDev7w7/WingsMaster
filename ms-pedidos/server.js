import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import conectarDB from './config/db.js'
import pedidoRoutes from './routes/pedidoRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json())
app.use('/api/pedidos', pedidoRoutes)

app.get('/', (req, res) => {
  res.json({ msg: 'MS Pedidos vivo' })
})

conectarDB()

app.listen(PORT, () => {
  console.log(`MS Pedidos corriendo en puerto ${PORT}`)
})
