import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from 'react-router-dom';
import "../assets/css/ItemsBar.css";
import { useTranslation } from "react-i18next";


export const ItemsBar = () => {
  const { hash } = useLocation();
  const collapseButtonRef = useRef(null); // Referencia al botón de colapso
  const [activeDropdown, setActiveDropdown] = useState(null); // Estado para el menú desplegable activo
  const [currentLanguage, setCurrentLanguage] = useState('es'); // Idioma predeterminado

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [hash]);

  const [navbarStyle, setNavbarStyle] = useState({
    position: 'fixed',
    width: '100vw',
    top: '13vh',
    transition: 'top 0.3s ease',
    zIndex: '1000',
  });

  const handleScroll = () => {
    if (window.scrollY > 15) {
      setNavbarStyle({
        ...navbarStyle,
        top: '5vh',
      });
    } else {
      setNavbarStyle({
        ...navbarStyle,
        top: '13vh',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleMouseEnter = (e, dropdownId) => {
    if (window.innerWidth >= 768) { // Detecta si no es móvil
      setActiveDropdown(dropdownId); // Establecer el menú desplegable activo
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setActiveDropdown(null); // Cerrar el menú desplegable cuando el mouse salga
    }
  };

  const handleDropdownClick = (dropdownId) => {
    // Cambia el estado del dropdown activo al hacer clic
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null); // Cierra el menú si ya está abierto
    } else {
      setActiveDropdown(dropdownId); // Abre el menú
    }
  };

  const handleNavLinkClick = () => {
    if (collapseButtonRef.current && window.getComputedStyle(collapseButtonRef.current).display !== 'none') {
      collapseButtonRef.current.click();
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <nav style={navbarStyle} className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid opciones">
          <button ref={collapseButtonRef} className="navbar-toggler mx-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/Inicio" onClick={() => { scrollToTop(); handleNavLinkClick(); }} className="nav-link navboton">
                  {t('inicio.inicio')}
                </NavLink>
              </li>

              <li className="nav-item dropdown" onMouseEnter={(e) => handleMouseEnter(e, 'sobreNosotros')} onMouseLeave={handleMouseLeave}>
                <NavLink to="/SobreNosotros" onClick={() => { scrollToTop(); handleDropdownClick('sobreNosotros'); }} className="nav-link navboton">
                  {t('sobrenosotros.sobrenosotros')}
                </NavLink>
                <ul className={`dropdown-menu ${activeDropdown === 'sobreNosotros' ? 'show' : ''}`}>
                  <li><NavLink to="/SobreNosotros/#historia" onClick={handleNavLinkClick} className="dropdown-item">{t('sobrenosotros.historia')}</NavLink></li>
                  <li><NavLink to="/SobreNosotros/#mision" onClick={handleNavLinkClick} className="dropdown-item">{t('sobrenosotros.mision')}</NavLink></li>
                  <li><NavLink to="/SobreNosotros/#vision" onClick={handleNavLinkClick} className="dropdown-item">{t('sobrenosotros.vision')}</NavLink></li>
                  <li><NavLink to="/SobreNosotros/#valores" onClick={handleNavLinkClick} className="dropdown-item">{t('sobrenosotros.valores')}</NavLink></li>
                  <li><NavLink to="/SobreNosotros/#innovacion" onClick={handleNavLinkClick} className="dropdown-item">{t('sobrenosotros.innovacion')}</NavLink></li>
                  <li><NavLink to="/SobreNosotros/#calidad" onClick={handleNavLinkClick} className="dropdown-item">{t('sobrenosotros.calidad')}</NavLink></li>
                </ul>
              </li>

              <li className="nav-item dropdown" onMouseEnter={(e) => handleMouseEnter(e, 'nuestrasPracticas')} onMouseLeave={handleMouseLeave}>
                <NavLink to="/NuestrasPracticas" onClick={() => { scrollToTop(); handleDropdownClick('nuestrasPracticas'); }} className="nav-link navboton">
                  {t('nuestraspracticas.nuestraspracticas')}
                </NavLink>
                <ul className={`dropdown-menu ${activeDropdown === 'nuestrasPracticas' ? 'show' : ''}`}>
                  <li><NavLink to="/NuestrasPracticas/#bienestar" onClick={handleNavLinkClick} className="dropdown-item">{t('nuestraspracticas.bienestar')}</NavLink></li>
                  <li><NavLink to="/NuestrasPracticas/#sostenibilidad" onClick={handleNavLinkClick} className="dropdown-item">{t('nuestraspracticas.sostenibilidad')}</NavLink></li>
                  <li><NavLink to="/NuestrasPracticas/#tecnologia" onClick={handleNavLinkClick} className="dropdown-item">{t('nuestraspracticas.tecnologia')}</NavLink></li>
                  <li><NavLink to="/NuestrasPracticas/#compromiso" onClick={handleNavLinkClick} className="dropdown-item">{t('nuestraspracticas.compromiso')}</NavLink></li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink to="/DelAulaAlTambo" onClick={() => { scrollToTop(); handleNavLinkClick(); }} className="nav-link navboton">
                  {t('delaulaaltambo.delaulaaltambo')}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/Aliados" onClick={() => { scrollToTop(); handleNavLinkClick(); }} className="nav-link navboton">
                  {t('aliados.aliados')}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
