import React from 'react'
import "../assets/css/nuestrasPracticas.css"
import { NPBienestarAnimal } from '../components/sobrenosotrosComp/NPBienestarAnimal'
import { NPSostenibilidadAmbiental } from '../components/sobrenosotrosComp/NPSostenibilidadAmbiental'
import { NPTecnologiaAvanzada } from '../components/sobrenosotrosComp/NPTecnologiaAvanzada'
import { NPCompromisoSocial } from '../components/sobrenosotrosComp/NPCompromisoSocial'
import { NPNavBar } from '../components/sobrenosotrosComp/NPNavBar'
import { Route, Routes } from 'react-router-dom'
import imagen from '../assets/images/fondoNuestrasPracticas2.webp'
import { useTranslation } from "react-i18next";

export const NuestrasPracticas = () => {
  const { t } = useTranslation();
  return (
    <>
      <img src={imagen} alt="" className='NPfondo' />
        <NPNavBar />
        <Routes>
          <Route path="/" element={<NPBienestarAnimal />}></Route>
          <Route path="bienestar" element={<NPBienestarAnimal />} />
          <Route path="sostenibilidad" element={<NPSostenibilidadAmbiental />} />
          <Route path="tecnologia" element={<NPTecnologiaAvanzada />} />
          <Route path="compromiso" element={<NPCompromisoSocial />} />
        </Routes>

        <div className=' text-center NPdiv'>
          <p className='NPtexto'>
            {t("nuestraspracticas.NPtexto")}
          </p>
        </div>
    </>
  )
}
