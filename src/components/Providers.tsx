'use client'

import { createTheme, MantineProvider, MantineColorScheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Provider } from 'react-redux'
import Store from '@/Store'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/ThemeContext'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Read theme from localStorage and ensure it's a valid MantineColorScheme
  const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem("theme") as MantineColorScheme : null) || "light"
  // Avoid rendering BrowserRouter on the server to prevent `document is not defined`
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const theme = createTheme({
    focusRing: "never",
    fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    headings: {
      fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    primaryColor: 'blue',
    primaryShade: 4, 
    colors: {
      'cape-cod': ['#f5f8f7', '#e0e7e6', '#c0cfcc', '#99afab', '#748d8a', '#597370', '#465b59', '#3b4a49', '#364342', '#2c3534', '#161d1d'],
      'blue': ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'],
    }
  })

  return (
    <Provider store={Store}>
      <HelmetProvider>
        <ThemeProvider>
          {mounted ? (
              <MantineProvider defaultColorScheme={savedTheme} theme={theme}>
                <Notifications position="top-center" zIndex={1000} />
                {children}
              </MantineProvider>
          ) : null}
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  )
}