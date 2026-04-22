import React from 'react'
import { useTranslation } from "react-i18next";

export const NPCompromisoSocial = () => {
  const { t } = useTranslation();
  return (
    <>
        <div id="compromiso" className='p-3 NPsection' >
        <h2 className='text-center NPh2'>{t("nuestraspracticas.compromiso")}</h2>
        <ul className="m-3 d-flex flex-column flex-lg-row justify-content-around list-unstyled">
          <li className="text-center NPItemLista px-3 w-50">
            <h5 className='NPh5'>{t("nuestraspracticas.educacionYConciencia")}</h5>
            <p>
            {t("nuestraspracticas.EYCTexto")}
            </p>
          </li>
          <li className="text-center NPItemLista px-3 w-50">
            <h5 className='NPh5'>{t("nuestraspracticas.colaboracionLocal")}</h5>
            <p>
            {t("nuestraspracticas.CLTexto")}
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}
