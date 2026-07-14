import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { PresenceStageProvider } from './context/PresenceStageContext'
import { SiteSettingsProvider } from './hooks/useSiteSettings'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteSettingsProvider>
        <LanguageProvider>
          <CartProvider>
            <PresenceStageProvider>
              <App />
            </PresenceStageProvider>
          </CartProvider>
        </LanguageProvider>
      </SiteSettingsProvider>
    </BrowserRouter>
  </StrictMode>
)
