import React, { useEffect } from "react";
import "../assets/css/delAulaAlTambo.css";
import imagen from "../assets/images/DelAulaAlTambo/Vaca Saltando.webp";
import logo from "../assets/images/Logotipo-04.webp";
import logoDAAT from "../assets/images/DelAulaAlTambo/logo.webp";
import { useTranslation } from "react-i18next";
import vaca2 from "../assets/images/DelAulaAlTambo/vaca2.webp";
import { Contacto } from "./Contacto";
import AOS from 'aos';
import 'aos/dist/aos.css';


export const DelAulaAlTambo = () => {

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: 'ease',
      once: false,
    });
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <div className="DelAulaAlTambo">
        <div className="seccion1">
          <div className="text-center textoseccion1 p-3">
            <img src={logoDAAT} alt="" className="img-fluid logoDAATs1 mb-3" />
          </div>

        </div>
        <img src={imagen} className="img-fluid vaca" alt="Vaca en el tambo" />

        <div className="d-flex align-items-end pizarraC">
          <img src={vaca2} alt="" className="img-fluid vaca2" />
          <div className="pizarra-container position-relative">

            <div className="text-center pizarra p-3 d-flex align-items-center justify-content-center position-relative">
              <div className="text-center textoprincipal p-3 my-3">
                <p>
                  {t("delaulaaltambo.pizarra1")}
                </p>
                <p>
                {t("delaulaaltambo.pizarra2")}
                </p>
                <p> {t("delaulaaltambo.pizarra3")}</p>
              </div>
            </div>
          </div>
        </div>


        <div className="text-center textoDAAT w-100 d-flex align-items-center justify-content-center">
          <div className="w-75 p-3">
            <img src={logo} alt="" className="img-fluid logoDAAT" />
            <p className="text-seccion2 mt-5">
            {t("delaulaaltambo.seccion2Texto")}
            </p>

          </div>
        </div>

        <div className="seccion3">
          <div className="area1" data-aos="fade-right">
            <h2 className="titulos3">{t("delaulaaltambo.experienciaPractica")}</h2>
            <p>
              {t("delaulaaltambo.EPTexto")}
            </p>
          </div>
          <div className="area4" data-aos="fade-left">
            <h2 className="titulos3">{t("delaulaaltambo.sostenibilidad")}</h2>
            <p>
            {t("delaulaaltambo.STexto")}
            </p>
          </div>
          <div className="area3">
            <div data-aos="fade-right">
              <h2 className="titulos3">{t("delaulaaltambo.bienestarAnimal")}</h2>
              <p>
              {t("delaulaaltambo.BATexto1")}
              </p>
            </div>
          </div>
          <div className="area2" data-aos="fade-left">
            <h2 className="titulos3">{t("delaulaaltambo.tecnologiaEInnovacion")}</h2>
            <p>
            {t("delaulaaltambo.TEITexto1")}
            </p>
          </div>
          
        </div>
      </div >

      <Contacto />
    </>
  );
};
