import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    return storedTheme ?? defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (theme: Theme) => {
      root.classList.remove('light', 'dark')
      const systemPrefersDark = mediaQuery.matches
      const resolved =
        theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme
      root.classList.add(resolved)
      console.log('Applied theme:', resolved)
    }

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    applyTheme(theme)
    mediaQuery.addEventListener('change', handleSystemChange)

    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    _setTheme(newTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
