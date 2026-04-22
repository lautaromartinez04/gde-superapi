import React from 'react'
import { useTranslation } from "react-i18next";

export const NPSostenibilidadAmbiental = () => {
  const { t } = useTranslation();
  return (
    <>
        <div id="sostenibilidad" className=' p-3 NPsection text-center' >
        <h2 className='text-center NPh2'>{t("nuestraspracticas.sostenibilidad")}</h2>
        <ul className="m-3 d-flex flex-column flex-lg-row justify-content-around list-unstyled">
          <li className="text-center NPItemLista px-3">
            <h5 className='NPh5'> {t("nuestraspracticas.economiaCircular")}</h5>
            <p>
            {t("nuestraspracticas.ECTexto")}
            </p>
          </li>
          <li className="text-center NPItemLista px-3">
            <h5 className='NPh5'> {t("nuestraspracticas.energiaRenovable")}</h5>
            <p>
            {t("nuestraspracticas.ERTexto")}
            </p>
          </li>
          <li className="text-center NPItemLista px-3">
            <h5 className='NPh5'> {t("nuestraspracticas.gestionDeAgua")}</h5>
            <p>
              {t("nuestraspracticas.GDATexto")}
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}
