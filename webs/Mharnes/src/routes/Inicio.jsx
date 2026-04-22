import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Inicio.css";
import { DashBoard } from "../components/DashBoard";
import { useTranslation } from "react-i18next";
import video from "../assets/images/iniciovideo.webm";
import carrusel0 from "../assets/images/carrusel0.webp";
import image1 from "../assets/images/tambo.webp";
import image2 from "../assets/images/vacas.webp";
import image3 from "../assets/images/ternero.webp";
import imgenfondo from "../assets/images/fondoinicio.webp";
import cbaentretodos from "../assets/images/Cordoba-entre-todos.webp";
import cbaSostenible from "../assets/images/Cordoba-Sostenible-2030.webp";
import qr from "../assets/images/QR-certificacion.webp";
import logo from "../assets/images/Logotipo-04.webp";
import AOS from "aos";
import "aos/dist/aos.css";
import { Typewriter } from "react-simple-typewriter";

export const Inicio = () => {
  const { t, i18n } = useTranslation(); // Agregado `i18n`
  const [isVisible, setIsVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [key, setKey] = useState(0); // Clave para reiniciar el Typewriter
  const textRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: "ease",
      once: true,
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 } // El texto comenzará a escribirse cuando esté al menos al 50% visible
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCursor(false); // Oculta el cursor al terminar
    }, 5000); // Ajusta el tiempo en milisegundos según la duración del texto

    return () => clearTimeout(timeout); // Limpia el timeout al desmontar
  }, [key]);

  useEffect(() => {
    // Cambia la clave del Typewriter cada vez que cambie el idioma
    setKey((prevKey) => prevKey + 1);
  }, [i18n.language]); // Observa cambios en el idioma

  return (
    <>
      <div className="colorfondo">
        <img src={imgenfondo} alt="" className="fondoinicio" />

        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="carousel-content position-relative d-flex align-items-center">
              {/* Video: Visible solo en pantallas medianas y grandes */}
              <video
                src={video}
                autoPlay
                loop
                muted
                className="video d-none d-md-block">
              </video>

              {/* Imagen o texto alternativo: Visible solo en pantallas pequeñas */}
              <img
                src={carrusel0}
                alt="Contenido alternativo"
                className="w-100 d-block d-md-none img-0">
              </img>

              {/* Texto que se superpone al contenido */}
              <div className="overlay-text position-absolute w-100 text-C1">
                <h1 className="textovideo w-100">{t("inicio.textovideo")}</h1>
                <h1 className="titulovideo w-100">{t("inicio.titulovideo")}</h1>
              </div>
            </div>
          </div>
        </div>

        <div data-aos="fade-down">
          <DashBoard />
        </div>

        <div className="InicioSeccion2 d-flex flex-column align-items-center">
          <div className="text-center textoInicios2" ref={textRef}>
            {isVisible && (
              <Typewriter
                key={key} // Actualiza la clave para reiniciar el componente
                words={[t("inicio.textoMDE")]} // Traducción dinámica
                loop={false}
                typeSpeed={30} // Velocidad de escritura
                deleteSpeed={0}
                delaySpeed={100000}
                cursor={showCursor} // El cursor se oculta después del timeout
              />
            )}
          </div>
          <img src={logo} alt="Logo" className="img-fluid logoinicio" />
        </div>

        <div className="FondoSeccion3 w-100">
          <div className="InicioSeccion3 w-100 d-flex flex-wrap flex-md-nowrap">

            <div className="d-flex flex-column align-items-center flex-wrap flex-md-nowrap">
              <div className="d-flex align-items-center justify-content-around w-100 flex-wrap flex-md-nowrap ">
                <h3 className="textoqr text-center mx-3">{t("inicio.certificacion")} <br />{t("inicio.ambiental")}</h3>
                <img src={qr} alt="" className="img-fluid qr" />
              </div>
              <img src={cbaentretodos} alt="" className="img-fluid cbaimgs1" />
            </div>


            <img src={cbaSostenible} alt="" className="img-fluid cbaimgs2" />


          </div>
        </div>

      </div>
    </>
  );
};
