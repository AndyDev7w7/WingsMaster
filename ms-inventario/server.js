import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import conectarDB from './config/db.js'
import inventarioRoutes from './routes/inventarioRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json())
app.use('/api/inventario', inventarioRoutes)

app.get('/', (req, res) => {
  res.json({ msg: 'MS Inventario vivo' })
})

conectarDB()

app.listen(PORT, () => {
  console.log(`MS Inventario corriendo en puerto ${PORT}`)
})
