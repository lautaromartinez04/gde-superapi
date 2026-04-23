import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'
import { checkUrlToken } from './api/auth.js'

// Configuración global de Axios para incluir la API Key en todas las peticiones
axios.defaults.headers.common['x-api-key'] = '<Donemilio@2026>';

// ── Capturar token SSO de la URL ANTES de que React Router renderice ──────────
// Esto garantiza que ?access_token=... se procese incluso si React Router
// haría una navegación interna antes de que ProtectedRoute corra su useEffect.
checkUrlToken();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

