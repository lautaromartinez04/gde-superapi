import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Footer from './pages/components/Footer';
import ScrollToTop from './pages/components/ScrollToTop';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Allies from './pages/Allies';
import ForCompanies from './pages/ForCompanies';
import Contact from './pages/Contact';
import LanguageToggle from './pages/components/LanguageToggle';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos" element={<TermsConditions />} />
        <Route path="/aliados" element={<Allies />} />
        <Route path="/empresas" element={<ForCompanies />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <LanguageToggle />
    </div>
  );
}

export default App;
