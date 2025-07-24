import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { SidePanel } from './SidePanel'
import { ThemeProvider } from 'styled-components'
import { FontSizeProvider } from '../contexts/FontSizeContext'
import './index.css'
import { defaultTheme, highContrastTheme } from '../styles/theme'

function App() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  return (
    <ThemeProvider theme={isHighContrast ? highContrastTheme : defaultTheme}>
      <FontSizeProvider>
        <SidePanel
          toggleContrast={() => setIsHighContrast((prev) => !prev)}
          isHighContrast={isHighContrast}
        />
      </FontSizeProvider>
    </ThemeProvider>
  )
}
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
