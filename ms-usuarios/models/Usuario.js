import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usrSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
      default: '',
    },
    direccion: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['cliente', 'administrador', 'empleado', 'repartidor'],
      default: 'cliente',
    },
    estado: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      default: 'Activo',
    },
  },
  { timestamps: true },
)

usrSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

usrSchema.methods.matchPassword = async function (passwordTxt) {
  return bcrypt.compare(passwordTxt, this.password)
}

const Usuario = mongoose.model('Usuario', usrSchema)

export default Usuario
