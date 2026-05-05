import mongoose from 'mongoose'

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Atlas Productos ok: ${conn.connection.host}`)
  } catch (err) {
    console.error('Mongo productos fallo:', err.message)
    process.exit(1)
  }
}

export default conectarDB
