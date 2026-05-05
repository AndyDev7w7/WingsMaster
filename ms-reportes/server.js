import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import conectarDB from './config/db.js'
import reporteRoutes from './routes/reporteRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3005

app.use(cors())
app.use(express.json())
app.use('/api/reportes', reporteRoutes)

app.get('/', (req, res) => {
  res.json({ msg: 'MS Reportes vivo' })
})

conectarDB()

app.listen(PORT, () => {
  console.log(`MS Reportes corriendo en puerto ${PORT}`)
})
