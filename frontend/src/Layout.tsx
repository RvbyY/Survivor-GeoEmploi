import { Outlet } from 'react-router-dom'
import Header from './components/Header'

function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout