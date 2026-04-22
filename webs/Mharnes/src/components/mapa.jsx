import React, { useState } from 'react';
import '../assets/css/map.css';
import mapImage from '../assets/images/sobrenosotros/mapa.webp';
import { useTranslation } from "react-i18next";

const Mapa = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const points = [
    { id: 1, x: 17.65, y: 60.8, label: "mapa.rotondaNestorGiraudo", size: 12, number: 1 },
    { id: 2, x: 54, y: 30, label: "mapa.ordeñeConvencional", size: 7, number: 2 },
    { id: 3, x: 64, y: 16, label: "mapa.guachera", size: 6, number: 3 },
    { id: 4, x: 76, y: 6, label: "mapa.patioComidas", size: 8, number: 4 },
    { id: 5, x: 66.7, y: 29, label: "mapa.establoConvencionalI", size: 13, number: 5 },
    { id: 6, x: 66.7, y: 47, label: "mapa.establoConvencionalII", size: 13, number: 5 },
    { id: 7, x: 66.7, y: 63.7, label: "mapa.establoRobotizado", size: 13, number: 6 },
    { id: 9, x: 48.4, y: 31, label: "mapa.oficinasYSum", size: 5, number: 7 },
    { id: 10, x: 77.5, y: 78, label: "mapa.recrias", size: 13, number: 8 },
    { id: 11, x: 82.8, y: 35, label: "mapa.lagunaISistemasEfluentes", size: 9, number: 9 },
    { id: 12, x: 82.8, y: 56, label: "mapa.lagunaIISistemasEfluentes", size: 9, number: 9 },
    { id: 13, x: 77.2, y: 28.3, label: "mapa.lagunaIContencionAguaLluvia", size: 5, number: 10 },
    { id: 14, x: 77.1, y: 40, label: "mapa.lagunaIIContencionAguaLluvia", size: 5, number: 10 },
    { id: 15, x: 77.1, y: 48.8, label: "mapa.lagunaIIIContencionAguaLluvia", size: 5, number: 10 },
    { id: 16, x: 77.1, y: 57.3, label: "mapa.lagunaIVContencionAguaLluvia", size: 5, number: 10 },
    { id: 17, x: 20, y: 20, label: "mapa.agriculturaYNutricion", size: 30, number: 11 },
    { id: 18, x: 41, y: 55, label: "mapa.barreraForestal", size: 7, number: 12 },
    { id: 19, x: 41, y: 35, label: "mapa.barreraForestal", size: 7, number: 12 },
    { id: 20, x: 55, y: 73, label: "mapa.barreraForestal", size: 7, number: 12 },
    { id: 21, x: 76.98, y: 64.48, label: "mapa.sistemaHomogeneizacionAgua", size: 4, number: 13 }
  ];

  const NamePoints = [
    { id: 1, label: "mapa.rotondaNestorGiraudo", number: "01" },
    { id: 2, label: "mapa.ordeñeConvencional", number: "02" },
    { id: 3, label: "mapa.guachera", number: "03" },
    { id: 4, label: "mapa.patioComidas", number: "04" },
    { id: 5, label: "mapa.establoConvencional", number: "05" },
    { id: 6, label: "mapa.establoRobotizado", number: "06" },
    { id: 7, label: "mapa.oficinasYSum", number: "07" },
    { id: 8, label: "mapa.recrias", number: "08" },
    { id: 9, label: "mapa.lagunaSistemasEfluentes", number: "09" },
    { id: 10, label: "mapa.lagunaContencionAguaLluvia", number: "10" },
    { id: 11, label: "mapa.agriculturaYNutricion", number: "11" },
    { id: 12, label: "mapa.barreraForestal", number: "12" },
    { id: 13, label: "mapa.sistemaHomogeneizacionAgua", number: "13" }
  ];

  const { t } = useTranslation();

  return (
    <>
      <div className="contenedor-mapa">
        <div className='map-title'>
          <h2 className='text-center'>{t("mapa.establecimiento")} <br />{t("mapa.GrupoMharnes")}</h2>
        </div>
        <div className="map-wrapper">
          <div className="map-container">
            <img src={mapImage} alt={t("mapa.mapaAlternativo")} className="map-image w-100 rounded" />
            {points.map((point) => (
              <div
                key={point.id}
                className="map-point d-flex justify-content-center align-items-center"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${point.size}vh`,
                  height: `${point.size}vh`
                }}
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <p className="map-point-number">{point.number}</p>
                {hoveredPoint === point.id && (
                  <p className="map-point-label">
                    {t(point.label)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="points-list">
          <ul className="list-unstyled">
            {NamePoints.map((point) => (
              <li key={point.id}>
                <span className="point-number-list">{point.number} </span>
                <span className="point-label-list">{t(point.label)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Mapa;
