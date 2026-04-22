import React from "react";
import { useTranslation } from "react-i18next";

export const NPTecnologiaAvanzada = () => {
  const { t } = useTranslation();
  return (
    <>
      <div id="tecnologia" className="p-3 NPsection text-center">
        <h2 className="text-center NPh2">
          {" "}
          {t("nuestraspracticas.tecnologia")}
        </h2>
        <ul className="m-3 d-flex flex-column flex-lg-row justify-content-around list-unstyled">
          <li className="text-center NPItemLista px-3">
            <h5 className="NPh5">{t("nuestraspracticas.robotsDeOrdeñe")}</h5>
            <p>{t("nuestraspracticas.RDOTexto")}</p>
          </li>
          <li className="text-center NPItemLista px-3">
            <h5 className="NPh5">{t("nuestraspracticas.monitoreoDigital")}</h5>
            <p>{t("nuestraspracticas.MDTexto")}</p>
          </li>
          <li className="text-center NPItemLista px-3">
            <h5 className="NPh5">{t("nuestraspracticas.trazabilidad")}</h5>
            <p>{t("nuestraspracticas.TTexto")}</p>
          </li>
        </ul>
      </div>
    </>
  );
};
