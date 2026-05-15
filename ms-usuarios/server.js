import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4001

app.use(cors())
app.use(express.json())
app.use('/api/usuarios', usuarioRoutes)

app.get('/', (req, res) => {
  res.json({ msg: 'MS Usuarios vivo' })
})

conectarDB()

app.listen(PORT, () => {
  console.log(`MS Usuarios corriendo en puerto ${PORT}`)
})
