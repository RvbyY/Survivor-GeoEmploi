import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/Authcontext.tsx'
import { ListingsProvider } from './context/Listingscontext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ListingsProvider>
        <App />
      </ListingsProvider>
    </AuthProvider>
  </StrictMode>,
)
