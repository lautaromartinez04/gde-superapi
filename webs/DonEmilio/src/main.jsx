import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import './hooks/i18next'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Configuración global de Axios para incluir la API Key en todas las peticiones
axios.defaults.headers.common['x-api-key'] = '<Donemilio@2026>';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/donemilio/">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
