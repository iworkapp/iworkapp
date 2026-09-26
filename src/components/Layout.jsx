import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'

const STORAGE_KEY = 'iwork.nav.collapsed'

function readCollapsed() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === '1') return true
    if (stored === '0') return false
  } catch {
    return false
  }
  return window.matchMedia('(max-width: 767px)').matches
}

export default function Layout() {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [overlay, setOverlay] = useState(false)
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [seenPath, setSeenPath] = useState(pathname)
  const expanded = narrow ? overlay : !collapsed

  if (seenPath !== pathname) {
    setSeenPath(pathname)
    if (overlay) setOverlay(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setNarrow(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
      // Private browsing can block storage.
    }
  }, [collapsed])

  const onToggle = () => {
    if (narrow) setOverlay((value) => !value)
    else setCollapsed((value) => !value)
  }

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-24 focus:top-4 focus:z-50 focus:rounded-full focus:bg-marigold focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Sidebar collapsed={!expanded} onToggle={onToggle} />
      <div className={`flex min-h-screen min-w-0 flex-col pl-[4.5rem] transition-[padding-left] duration-300 ease-out ${expanded && !narrow ? 'md:pl-60' : ''}`}>
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
