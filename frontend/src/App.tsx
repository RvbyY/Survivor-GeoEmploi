import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/Notfound'
import './App.css'
import ServerError from './pages/Servererror'
import ErrorBoundary from './components/Errorboundary'
import Login from './pages/Login'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App