import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import conectarDB from './config/db.js'
import pagoRoutes from './routes/pagoRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3004

app.use(cors())
app.use(express.json())
app.use('/api/pagos', pagoRoutes)

app.get('/', (req, res) => {
  res.json({ msg: 'MS Pagos vivo' })
})

conectarDB()

app.listen(PORT, () => {
  console.log(`MS Pagos corriendo en puerto ${PORT}`)
})
