import './App.css'
import './styles/Home.css'
import './styles/PageTransition.css'
import { useEffect, useState } from 'react'
import UnwrittenEvents from './Pages/UnwrittenEvents'
import ServicesPage from './Pages/ServicesPage'

function App() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const onHash = () => {
      setIsTransitioning(true)
      // Start transition effect
      setTimeout(() => {
        setHash(window.location.hash || '#/')
        setIsTransitioning(false)
      }, 300)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Render pages with transition container
  const pageContent =
    hash.startsWith('#/services') || hash === '#services' ? <ServicesPage /> : <UnwrittenEvents />

  return (
    <div className={`page-container ${isTransitioning ? 'transitioning' : ''}`}>
      {pageContent}
    </div>
  )
}

export default App
