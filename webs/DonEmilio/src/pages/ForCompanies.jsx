import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import carrito from '../media/images/schedules/carrito.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

const ForCompanies = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-[#0033a1] min-h-screen pt-10 pb-8 px-4 md:px-8 font-tommy relative overflow-hidden">
            {/* Background Pattern */}
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

                <div className="text-center mb-10">
                    <p className="text-white text-xl md:text-2xl font-light mb-2 drop-shadow-sm">{t('paraEmpresas.presentamos')}</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-wider drop-shadow-md pb-6">
                        {t('paraEmpresas.giftcardtitle')}
                    </h1>
                    <div className="inline-block bg-white px-6 py-2 shadow-md">
                        <p className="text-[#E30613] font-bold text-sm md:text-base">
                            {t('paraEmpresas.beneficios')}
                        </p>
                    </div>
                </div>

                <div className="space-y-12 text-white leading-relaxed mt-12 w-full max-w-3xl mx-auto">
                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md">{t('paraEmpresas.que es')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white my-3 opacity-80 mx-auto"></div>
                        <div className="text-lg font-light opacity-90 pl-2 border-l-2 border-[#E30613]/50 text-center space-y-4">
                            <p>
                                {t('paraEmpresas.que es texto1')}
                            </p>
                            <p>
                                {t('paraEmpresas.que es texto2')}
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md">{t('paraEmpresas.beneficiosYCondiciones')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white my-3 opacity-80 mx-auto"></div>
                        <div className="text-lg font-light opacity-90 text-left md:text-center w-fit mx-auto pl-2 border-l-2 border-[#E30613]/50 md:border-l-0 md:pl-0 pt-2">
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCheck} className="text-[#E30613]" />
                                    <span>{t('paraEmpresas.beneficio 1')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCheck} className="text-[#E30613]" />
                                    <span>{t('paraEmpresas.beneficio 2')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCheck} className="text-[#E30613]" />
                                    <span>{t('paraEmpresas.beneficio 3')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCheck} className="text-[#E30613]" />
                                    <span>{t('paraEmpresas.beneficio 4')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCheck} className="text-[#E30613]" />
                                    <span>{t('paraEmpresas.beneficio 5')}</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="w-full flex justify-center">
                            <span className="block transform bg-[#E30613] text-white font-bold text-lg py-1 px-4 w-fit uppercase tracking-wider mb-2 shadow-md">{t('paraEmpresas.solicitar')}</span>
                        </div>
                        <div className="w-12 h-1 bg-white mt-3 opacity-80 mx-auto"></div>
                        <div className="pt-5 text-center">
                            <a
                                href="https://wa.me/5493534811170"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-3 bg-[#25D366] text-white font-bold text-lg rounded-full shadow-[0_10px_20px_-5px_rgba(37,211,102,0.4)] hover:brightness-110 hover:scale-105 transition-all duration-300"
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                </svg>
                                {t('paraEmpresas.contactanos')}
                            </a>
                        </div>
                    </section>

                    <div className="pt-0 text-center">
                        <Link
                            to="/"
                            className="inline-block px-8 py-3 bg-[#0033a1] text-white border-2 lg:border-3 border-white font-bold rounded-full hover:bg-[#E30613] hover:text-white transition-all duration-300 shadow-lg"
                        >
                            <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
                            {t('paraEmpresas.volveralinicio')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForCompanies;
