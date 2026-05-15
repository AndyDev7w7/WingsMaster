import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { authService } from '../services/authService'
import { getUserHome, normalizeRole } from '../utils/formatters'

const storedUser = () => {
  try {
    const raw = localStorage.getItem('wm_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser)
  const [loading, setLoading] = useState(false)

  const saveSession = useCallback((data) => {
    const usr = { ...data, role: normalizeRole(data.role) }
    localStorage.setItem('wm_user', JSON.stringify(usr))
    if (usr.token) localStorage.setItem('wm_token', usr.token)
    setUser(usr)
    return usr
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const data = await authService.login(credentials)
      return saveSession(data)
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const data = await authService.register(payload)
      return saveSession(data)
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  const updateProfile = useCallback((payload) => {
    const run = async () => {
      try {
        const data = await authService.actualizarPerfil(payload)
        const next = { ...user, ...data, token: user?.token }
        localStorage.setItem('wm_user', JSON.stringify(next))
        setUser(next)
        return next
      } catch {
        const next = { ...user, ...payload }
        localStorage.setItem('wm_user', JSON.stringify(next))
        setUser(next)
        return next
      }
    }

    return run()
  }, [user])

  const logout = useCallback(() => {
    localStorage.removeItem('wm_user')
    localStorage.removeItem('wm_token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuth: Boolean(user),
      home: getUserHome(user?.role),
    }),
    [user, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
