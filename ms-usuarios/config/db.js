import mongoose from 'mongoose'

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Atlas Exitosa: ${conn.connection.host}`)
  } catch (err) {
    console.error('Mongo fallo:', err.message)
    process.exit(1)
  }
}

export default conectarDB
