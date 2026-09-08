import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/Common.css'
import './styles/Header.css'
import './styles/Footer.css'
import './styles/Home.css'
import './styles/Map.css'
import './styles/Offerdetail.css'
import './styles/Publishoffer.css'
import './styles/Profile.css'
import App from './App.tsx'
import { AuthProvider } from './context/Authcontext.tsx'
import { ListingsProvider } from './context/Listingscontext.tsx'
import { ApplicationsProvider } from './context/Applicationscontext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ListingsProvider>
        <ApplicationsProvider>
          <App />
        </ApplicationsProvider>
      </ListingsProvider>
    </AuthProvider>
  </StrictMode>,
)
