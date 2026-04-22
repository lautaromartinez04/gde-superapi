import React from 'react'
import { useTranslation } from "react-i18next";

export const NPBienestarAnimal = () => {
  const { t } = useTranslation();
  return (
    <>
      <div id="bienestar" className='p-3 NPsection text-center' >
        <h2 className='text-center NPh2'>{t("nuestraspracticas.bienestar")}</h2>
        <ul className="m-3 d-flex flex-column flex-lg-row justify-content-around list-unstyled">
          <li className="text-center NPItemLista px-3">
            <h5 className='NPh5'>{t("nuestraspracticas.instalacionesEspaciosas")}</h5>
            <p>
            {t("nuestraspracticas.IETexto")}
            </p>
          </li>
          <li className="text-center NPItemLista px-3">
            <h5 className='NPh5'>{t("nuestraspracticas.atencionVeterinaria")}</h5>
            <p>
            {t("nuestraspracticas.AVTexto")}
            </p>
          </li>
          <li className="text-center NPItemLista px-3">
            <h5 className='NPh5'>{t("nuestraspracticas.alimentacionBalanceada")}</h5>
            <p>
            {t("nuestraspracticas.ABTexto")}
            </p>
          </li>
        </ul>

      </div>
    </>
  )
}
