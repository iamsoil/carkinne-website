import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext<{
  isDark: boolean
  toggleDark: () => void
}>({ isDark: false, toggleDark: () => {} })

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleDark: () => setIsDark(prev => !prev) 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)