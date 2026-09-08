import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

export default function Layout() {
  useEffect(() => {
    const header = document.querySelector('.app-header')
    if (!header) return

    const setHeaderHeightVar = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.getBoundingClientRect().height}px`
      )
    }

    setHeaderHeightVar()
    const observer = new ResizeObserver(setHeaderHeightVar)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}