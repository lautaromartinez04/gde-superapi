import React from 'react'
import "../assets/css/NavBar.css"
import imagen from '../assets/images/Logotipo-04.png'
import { useTranslation } from "react-i18next";
import i18n from "../hooks/i18next";
import { useState } from 'react';


export const NavBar = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const { t } = useTranslation();

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage); // Actualiza el estado del idioma
  };

  return (
    <>
        <div className='barra'>
          <div>
              <img className='logo' src={imagen} alt="" />
          </div>
      </div>
      <button 
        type="button" 
        className="btn btn-primary botonidioma" 
        onClick={handleLanguageChange}
      >
        <i className="fa-solid fa-language me-2 icono"></i> {currentLanguage === 'es' ? 'Es' : 'En'}
      </button>
    
    </>
    
  )
}
