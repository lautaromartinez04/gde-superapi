import React from 'react';
import '../assets/css/footer.css';
import logo from '../assets/images/isologotipo blanco.webp';
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const { t } = useTranslation();

  return (
    <div className="footer text-white pb-3">
      <footer className="container">
        <div className="row align-items-center">
          {/* Links de navegación */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <ul className="nav flex-column text-center text-md-start">
              <li className="nav-item">
                <NavLink to="/" className="nav-link text-white" onClick={scrollToTop}>
                  {t("inicio.inicio")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/SobreNosotros" className="nav-link text-white" onClick={scrollToTop}>
                  {t("sobrenosotros.sobrenosotros")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/NuestrasPracticas" className="nav-link text-white" onClick={scrollToTop}>
                  {t("nuestraspracticas.nuestraspracticas")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/DelAulaAlTambo" className="nav-link text-white" onClick={scrollToTop}>
                  {t("delaulaaltambo.delaulaaltambo")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Aliados" className="nav-link text-white" onClick={scrollToTop}>
                  {t("aliados.aliados")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Contacto" className="nav-link text-white" onClick={scrollToTop}>
                  {t("contacto.contacto")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="https://grupodonemilio.com/unite/" className="nav-link text-white" target='_blank' rel="noopener noreferrer" onClick={scrollToTop}>
                  {t("footer.trabajaConNosotros")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="col-12 col-md-4 d-flex justify-content-center align-items-center mb-4 mb-md-0 flex-wrap botonylogo">
            <div className="w-100 text-center mb-5">
              <button className="btn btn-outline-light" onClick={scrollToTop}>
                {t("footer.subir")}
              </button>
            </div>

            <img src={logo} className="img-fluid w-75" alt="Logo" />
          </div>

          {/* Información de contacto */}

          <div className="col-12 col-md-4 text-center text-md-end redes">
            <a href="https://maps.app.goo.gl/94kKktqq3oqMqPVv6" target='_blank' rel="noopener noreferrer">
              <button className="btn btn-outline-light my-5">
                {t("footer.comoLlegar")}
                <i className="fa-solid fa-location-dot ms-2"></i>
              </button>
            </a>

            <ul className="list-inline redeslist w-100 d-flex justify-content-center gap-3">
              <li className="list-inline-item">
                <a href="https://www.instagram.com/grupomharnes/?hl=es-la" target='_blank' rel="noopener noreferrer" className="text-white">
                  <i className="fa-brands fa-instagram fa-2x"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.facebook.com/grupomharnes/?locale=es_LA" target='_blank' rel="noopener noreferrer" className="text-white">
                  <i className="fa-brands fa-facebook fa-2x"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" target='_blank' rel="noopener noreferrer" className="text-white">
                  <i className="fa-brands fa-youtube fa-2x"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row border-top mt-4 pt-3">
          <div className="col text-center">
            <p className="mb-0">&copy; {t("footer.copyright")} - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
