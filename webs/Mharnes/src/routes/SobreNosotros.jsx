import React, { useEffect } from 'react';
import "../assets/css/sobreNosotros.css";
import Mapa from '../components/mapa';
import video from '../assets/images/sobrenosotros/sobrenosotrosvideo.webm';
import fondo from '../assets/images/sobrenosotros/FondoSobreNosotros.webp';
import { useTranslation } from "react-i18next";
import AOS from 'aos';
import 'aos/dist/aos.css';

export const SobreNosotros = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease',
      once: false,
    });

    const handleResize = () => {
      const dashBoardElement = document.querySelector("[data-aos='flip-up']");
      if (dashBoardElement) {
        if (window.innerWidth < 768) {
          dashBoardElement.removeAttribute("data-aos");
        } else {
          dashBoardElement.setAttribute("data-aos", "flip-up");
        }
      }
    };

    handleResize(); // Verificar al cargar la página
    window.addEventListener("resize", handleResize); // Escuchar cambios de tamaño

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <div className='SobreNosotrosfondo'>

        <h1 className='SobreNosotros'><span className='SNRenglon1'>{t("sobrenosotros.somos")} <span className="SNTitulo">{t("sobrenosotros.porquefueron")}</span> </span> <br />
        <span className='SNRenglon2'> {t("sobrenosotros.seran")}<span className="SNTitulo">{t("sobrenosotros.porquesomos")}</span></span> </h1>

        <div className='colorFondoSobreNosotros'>
          <div className='contenedorSobreNosotros'>

            <div id="historia" className='historia p-3' data-aos="fade-right">
              <div>
                <h2 className='px-3 tituloSobreNosotros text-center'>{t("sobrenosotros.historia")}</h2>
                <p className='mx-3 my-3 hovertext'>{t("sobrenosotros.historiaTexto")}</p>
              </div>
            </div>

            <div className='d-flex justify-content-end w-100'>
              <div id="mision" className='mision p-3' data-aos="fade-left">
                <div>
                  <h2 className='px-3 tituloSobreNosotros text-end text-center'>{t("sobrenosotros.mision")}</h2>
                  <p className='mx-3 my-3 hovertext'> {t("sobrenosotros.misionTexto")}</p>
                </div>

              </div>
            </div>


            <div className='visiondiv' data-aos="fade-right">
              <div id="vision" className='vision rounded p-3'>
                <h2 className='px-3 tituloSobreNosotros text-center'>{t("sobrenosotros.vision")}</h2>
                <p className='mx-3 my-3 hovertext'>{t("sobrenosotros.visionTexto")}</p>
              </div>
            </div>



            <div className='valoresdiv1' >
              <div className="row row-cols-1 row-cols-md-4 g-4 text-center valoresdiv rounded w-100 m-0" data-aos="fade-up">
                <h3 className='text-center tituloSobreNosotros w-100'>{t("sobrenosotros.valores")}</h3>
                <div className="col">
                  <div className="card h-100 cardSobrenosotros">
                    <div className="card-body">
                      <h5 className='card-title titulosvalores' >{t("sobrenosotros.valoresCompromiso")}</h5>
                      <p className='mx-3 card-text card-textSobreNosotros'>
                        {t("sobrenosotros.valoresCompromisoTexto")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 cardSobrenosotros" >
                    <div className="card-body">
                      <h5 className='card-title titulosvalores' >{t("sobrenosotros.valoresSostenibilidad")}</h5>
                      <p className='mx-3 card-text'>
                        {t("sobrenosotros.valoresSostenibilidadTexto")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 cardSobrenosotros">
                    <div className="card-body">
                      <h5 className='card-title titulosvalores' >{t("sobrenosotros.innovacion")}</h5>
                      <p className='mx-3 card-text'>
                        {t("sobrenosotros.innovacionTexto")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100 cardSobrenosotros">
                    <div className="card-body">
                      <h5 className='text-center titulosvalores' >{t("sobrenosotros.calidad")}</h5>
                      <p className='mx-3'>
                        {t("sobrenosotros.calidadTexto")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>






          <Mapa />

        </div>


        <video src={video} autoPlay loop muted className="videosobrenosotros d-none d-md-block"></video>
        <img src={fondo} className="videosobrenosotros d-block d-md-none" alt="" />

      </div>
    </>
  );
};
