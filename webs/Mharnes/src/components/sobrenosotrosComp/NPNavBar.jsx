import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../assets/css/sobrenosotros.css'
import { useTranslation } from "react-i18next";

export const NPNavBar = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className='NPnav'>
        <nav className='NPNavBar'>
                <NavLink className={'py-3 text-center w-25 NPA'} to={'/NuestrasPracticas/bienestar'}>{t("nuestraspracticas.bienestar")}</NavLink>
                <NavLink className={'py-3 text-center w-25 NPA'} to={'/NuestrasPracticas/sostenibilidad'}>{t("nuestraspracticas.sostenibilidad")}</NavLink>
                <NavLink className={'py-3 text-center w-25 NPA'} to={'/NuestrasPracticas/tecnologia'}>{t("nuestraspracticas.tecnologia")}</NavLink>
                <NavLink className={'py-3 text-center w-25 NPA'} to={'/NuestrasPracticas/compromiso'}>{t("nuestraspracticas.compromiso")}</NavLink>
        </nav>
      </div>
        
    </>
  )
}
