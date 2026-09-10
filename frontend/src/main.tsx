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
import './styles/Repport.css'
import './styles/Admindashboard.css'
import App from './App.tsx'
import { AuthProvider } from './context/Authcontext.tsx'
import { ListingsProvider } from './context/Listingscontext.tsx'
import { ApplicationsProvider } from './context/Applicationscontext.tsx'
import { ReportsProvider } from './context/Reportscontext.tsx'
import { AccountsProvider } from './context/Accountscontext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ListingsProvider>
        <ApplicationsProvider>
          <AccountsProvider>
            <ReportsProvider>
              <App />
            </ReportsProvider>
          </AccountsProvider>
        </ApplicationsProvider>
      </ListingsProvider>
    </AuthProvider>
  </StrictMode>,
)
