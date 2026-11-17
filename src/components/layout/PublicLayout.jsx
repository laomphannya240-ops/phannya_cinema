import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from '../common/ScrollToTop.jsx'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <ScrollToTop />
      <Header />
      <main key={location.pathname} className="page-enter flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
