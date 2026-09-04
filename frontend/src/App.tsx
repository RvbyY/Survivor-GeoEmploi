import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/Notfound'
import './App.css'
import ServerError from './pages/Servererror'
import ErrorBoundary from './components/Errorboundary'
import Login from './pages/Login'
import Layout from './Layout'
import MapPage from './pages/Map'
import OfferDetail from './pages/Offerdetail'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/offres/:id" element={<OfferDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App