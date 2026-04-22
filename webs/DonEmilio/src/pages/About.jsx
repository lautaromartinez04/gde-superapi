import React from 'react';
import HistoryTimeline from './components/HistoryTimeline';
import about1 from '../media/images/About/about1.webp';
import about2 from '../media/images/About/about2.webp';
import about3 from '../media/images/About/about3.webp';
import about4 from '../media/images/About/about4.webp';

const historyData = [
    {
        year: '1995',
        title: 'Fundación de Don Emilio',
        description: 'Abrimos nuestras puertas con la visión de ofrecer productos de calidad y una atención cercana a la comunidad.',
        image: about1
    },
    {
        year: '2003',
        title: 'Ampliación sucursal Tucumán',
        description: 'Se realiza la primera ampliación, duplicando el tamaño de la sucursal y mejorando la capacidad de atención.',
        image: about2
    },
    {
        year: '2006',
        title: 'Inauguración sucursal Av. Perón',
        description: 'Abrimos una nueva sucursal mayorista en Av. Perón, con mayor espacio y variedad de productos.',
        image: about3
    },
    {
        year: '2012',
        title: 'Ampliación sucursal Av. Perón',
        description: 'Se expande la sucursal mayorista para optimizar la experiencia de compra y mejorar la atención al cliente.',
        image: about4
    },
    {
        year: '2019',
        title: 'Reestructuración sucursal Tucumán',
        description: 'Se realiza un reacomodamiento y ampliación con una distribución más estratégica y mayor variedad de productos.',
        image: about1
    },
    {
        year: '2025',
        title: 'Inauguración espacio Duy Amis',
        description: 'Se incorpora el espacio Duy Amis en la sucursal Av. Perón, dedicado a la venta y degustación de productos.',
        image: about2
    }
];

const About = () => {
    return (
        <div className="h-[calc(100dvh-60px)] md:h-[calc(100vh-120px)] bg-gray-50 font-tommy overflow-hidden">
            <div className="w-full h-full">
                <HistoryTimeline data={historyData} />
            </div>
        </div>
    );
};

export default About;
