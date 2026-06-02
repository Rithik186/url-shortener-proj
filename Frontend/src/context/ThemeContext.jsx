import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('sniplink-theme')
    return saved === 'dark'
  })

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark')
      localStorage.setItem('sniplink-theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('sniplink-theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
