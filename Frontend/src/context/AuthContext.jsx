import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user exists in local storage on load
    const storedUser = localStorage.getItem('sniplink-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('sniplink-user', JSON.stringify(userData))
    if (token) localStorage.setItem('sniplink-token', token)
    toast.success('Login successful! Welcome back.')
    navigate('/home')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('sniplink-user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('sniplink-user')
    localStorage.removeItem('sniplink-token')
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
