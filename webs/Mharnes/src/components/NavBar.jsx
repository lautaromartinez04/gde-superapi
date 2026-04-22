import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../assets/css/navBar.css';
import logo from '../assets/images/Logotipo-04.webp';
import { useTranslation } from "react-i18next";
import i18n from "../hooks/i18next";
import DAATLogo from "../assets/images/DelAulaAlTambo/logo.webp";

export const NavBar = () => {
    const [currentLanguage, setCurrentLanguage] = useState('es');
    const { t } = useTranslation();
    const navbarCollapseRef = useRef(null); // Referencia al contenedor colapsable

    const handleLanguageChange = () => {
        const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const closeMenu = () => {
        if (navbarCollapseRef.current) {
            navbarCollapseRef.current.classList.remove('show'); // Cierra el menú
        }
    };

    return (
        <>
            <div className="barra"></div>
            <nav className="navbar navbar-expand-lg navbar-dark shadow sticky-top text-center">
                <Link className="navbar-brand" to="/" onClick={scrollToTop}>
                    <img className="logo" src={logo} alt="" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse justify-content-end"
                    id="navbarNav"
                    ref={navbarCollapseRef} // Asigna la referencia
                >
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/" className="nav-link">{t("inicio.inicio")}</NavLink>
                        </li>
                        <li className="nav-item" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/SobreNosotros" className="nav-link">{t("sobrenosotros.sobrenosotros")}</NavLink>
                        </li>
                        <li className="nav-item" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/NuestrasPracticas/bienestar" className="nav-link">{t("nuestraspracticas.nuestraspracticas")}</NavLink>
                        </li>
                        <li className="nav-item" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/Contacto" className="nav-link">{t("contacto.contacto")}</NavLink>
                        </li>
                        <li className="nav-item" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/Aliados" className="nav-link">{t("aliados.aliados")}</NavLink>
                        </li>
                        <li className="nav-item" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/Comentarios" className="nav-link">{t("comentarios.comentarios")}</NavLink>
                        </li>
                        <li className="nav-item d-none d-lg-block" onClick={() => { scrollToTop(); closeMenu(); }}>
                            <NavLink to="/DelAulaAlTambo" className="nav-link m-0 p-0">
                                <img src={DAATLogo} className="DAATLogo img-fluid" alt="" />
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
            <button
                type="button"
                className="btn btn-primary botonidioma"
                onClick={handleLanguageChange}
            >
                <i className="fa-solid fa-language me-2 icono"></i> {currentLanguage === 'es' ? 'Es' : 'En'}
            </button>
            <Link to="/DelAulaAlTambo" className="botonDAAT m-0 p-0">
                <img src={DAATLogo} className="img-fluid DAATLogoboton" alt="" />
            </Link>
        </>
    );
};
