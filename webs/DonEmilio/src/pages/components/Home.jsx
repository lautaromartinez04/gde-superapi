import React from 'react';
import videoBgPc from '../../media/images/home/donemiliopc.webm';
import videoBgMovil from '../../media/images/home/donemiliomovil.webm';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="relative w-full h-[calc(100vh-96px)] md:h-[calc(100vh-84px)] font-tommy overflow-hidden">
            {/* Background Video - PC */}
            <video
                className="absolute inset-0 w-full h-full object-cover hidden md:block"
                src={videoBgPc}
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Background Video - Mobile */}
            <video
                className="absolute inset-0 w-full h-full object-cover block md:hidden"
                src={videoBgMovil}
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
                <div className="max-w-4xl">
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-xl leading-tight">
                        <span className="block text-[#0033a1] text-shadow-lg">{t('inicio.tradicionYCalidad')}</span>
                        <span className="block text-white mt-2 text-shadow-lg">{t('inicio.cadaProducto')}</span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Home;
