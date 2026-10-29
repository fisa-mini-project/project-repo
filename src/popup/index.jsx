import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReaderApp } from '../reader/ReaderApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <ReaderApp />
  </React.StrictMode>,
)
