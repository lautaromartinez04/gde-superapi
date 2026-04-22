import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './hooks/i18next'




createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/mharnes">
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
)
