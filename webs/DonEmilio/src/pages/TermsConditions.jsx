import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import carrito from '../media/images/schedules/carrito.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const TermsConditions = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-[#0033a1] min-h-screen pt-10 pb-8 px-4 md:px-8 font-tommy relative overflow-hidden">
            {/* Background Pattern - Same as Schedules.jsx */}
            <div
                className="absolute top-1/2 left-1/2 z-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url(${carrito})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '70px',
                    width: '150vmax',
                    height: '150vmax',
                    transform: 'translate(-50%, -50%) rotate(-45deg)'
                }}
            ></div>

            <div className="w-full mx-auto border-2 border-white rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">

                <h1 className="text-4xl text-white font-bold text-center mb-12 tracking-wider drop-shadow-md border-b-2 border-white/20 pb-6">
                    {t('terminos.titulo')}
                </h1>

                <div className="space-y-10 text-white leading-relaxed">
                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md inline-block transform">{t('terminos.dato1')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white my-3 opacity-80 mx-auto"></div>
                        <p className="text-lg font-light opacity-90 pl-2 border-l-2 border-[#E30613]/50 text-center">
                            {t('terminos.texto1')}
                        </p>
                    </section>

                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md inline-block transform">{t('terminos.dato2')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white my-3 opacity-80 mx-auto"></div>
                        <p className="text-lg font-light opacity-90 pl-2 border-l-2 border-[#E30613]/50 text-center">
                            {t('terminos.texto2')}
                        </p>
                    </section>

                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md inline-block transform">{t('terminos.dato3')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white my-3 opacity-80 mx-auto"></div>
                        <p className="text-lg font-light opacity-90 pl-2 border-l-2 border-[#E30613]/50 text-center">
                            {t('terminos.texto3')}
                        </p>
                    </section>

                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md inline-block transform">{t('terminos.dato4')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white my-3 opacity-80 mx-auto"></div>
                        <p className="text-lg font-light opacity-90 pl-2 border-l-2 border-[#E30613]/50 text-center">
                            {t('terminos.texto4')}
                        </p>
                    </section>

                    <div className="pt-2 text-center">
                        <Link
                            to="/"
                            className="inline-block px-8 py-3 bg-[#0033a1] text-white border-3 border-white font-bold rounded-full hover:bg-[#E30613] hover:text-white transition-all duration-300 shadow-lg"
                        >
                            <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
                            {t('terminos.boton')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
