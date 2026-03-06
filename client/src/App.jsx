import './App.css'
import './styles/Home.css'
import './styles/PageTransition.css'
import { useEffect, useState } from 'react'
import UnwrittenEvents from './Pages/UnwrittenEvents'
import ServicesPage from './Pages/ServicesPage'
import Testimonials from './Pages/Testimonials'
import OurWork from './Pages/OurWork'
import BlogPage1  from './pages/BlogPage1';
import BlogPage2  from './pages/BlogPage2';
import BlogPage3  from './pages/BlogPage3';
import BlogPage4  from './pages/BlogPage4';
import Blogs from './pages/Blogs'
import FreeConsultation from './Pages/FreeConsultation'
import FreeConsultationDone from './Pages/FreeConsultationDone'
import ContactUs from './Pages/ContactUs'

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
    hash.startsWith('#/services') || hash === '#services' ? <ServicesPage /> :
    hash.startsWith('#/testimonials') || hash === '#testimonials' ? <Testimonials /> :
      hash.startsWith('#/our-work') || hash === '#our-work' ? <OurWork /> :
      hash.startsWith('#/blogs/1') || hash === '#/blogs/1' ? <BlogPage1 /> :
      hash.startsWith('#/blogs/2') || hash === '#/blogs/2' ? <BlogPage2 /> :
      hash.startsWith('#/blogs/3') || hash === '#/blogs/3' ? <BlogPage3 /> :
      hash.startsWith('#/blogs/4') || hash === '#/blogs/4' ? <BlogPage4 /> :
      hash.startsWith('#/blogs') || hash === '#/blogs' ? <Blogs /> :
      hash.startsWith('#/free-consultation') || hash === '#/free-consultation' ? <FreeConsultation /> :
      hash.startsWith('#/consultation-done') || hash === '#/consultation-done' ? <FreeConsultationDone /> :
      hash.startsWith('#/contact-us') || hash === '#/contact-us' ? <ContactUs /> :
      <UnwrittenEvents />


  return (
    <div className={`page-container ${isTransitioning ? 'transitioning' : ''}`}>
      {pageContent}
    </div>
  )
}

export default App
