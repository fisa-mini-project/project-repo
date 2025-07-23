import React from 'react'
import ReactDOM from 'react-dom/client'
import { SidePanel } from './SidePanel'
import { FontSizeProvider } from '../contexts/FontSizeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <FontSizeProvider>
      <SidePanel />
    </FontSizeProvider>
  </React.StrictMode>,
)
