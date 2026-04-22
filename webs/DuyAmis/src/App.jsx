import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './pages/components/Navbar.jsx'
import Footer from './pages/components/Footer.jsx'
import ScrollToTop from './pages/components/ScrollToTop.jsx'
import ScrollReset from './pages/components/ScrollReset.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import About from './pages/About.jsx'
import History from './pages/History.jsx'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import PuntosVenta from './pages/PuntosVenta.jsx'
import Allies from './pages/Allies.jsx'
import LanguageToggle from './pages/components/LanguageToggle.jsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollReset />
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/historia" element={<History />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/comprar" element={<PuntosVenta />} />
          <Route path="/aliados" element={<Allies />} />
          <Route path="/producto/:categoryIndex/:productId" element={<ProductDetail />} />

        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
      <LanguageToggle />
    </div>
  )
}

export default App
