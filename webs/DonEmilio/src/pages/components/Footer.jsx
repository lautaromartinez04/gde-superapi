import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../media/images/navbar/donemilio1.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const [emailCopied, setEmailCopied] = useState(false);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/donemilio/branches`)
            .then(res => setBranches(res.data))
            .catch(() => { });
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('recursoshumanos@donemiliosrl.com.ar');
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    return (
        <footer className="bg-[#0033a1] text-white pt-5 pb-2 font-tommy border-t border-white/10 relative overflow-hidden z-50">
            {/* WATERMARK BACKGROUND - 90% Size */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none overflow-hidden">
                <img
                    src={logo}
                    alt=""
                    className="max-w-[90%] max-h-[90%] w-auto h-auto object-contain brightness-0 invert scale-125"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* COLUMN 1: CÓMO LLEGAR */}
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-3xl mb-10 font-bold tracking-widest text-white inline-block relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-1 after:bg-[#E30613] after:rounded-full">
                            {t('footer.comoLlegar')}
                        </h3>
                        <div className="flex flex-col gap-4 text-lg font-bold">
                            {branches.map(branch => (
                                <a
                                    key={branch.id}
                                    href={branch.maps_url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center md:justify-start justify-center gap-3 text-white transition-all duration-300 transform hover:scale-105 origin-left"
                                >
                                    <span className="text-white group-hover:text-[#EA4335] transition-colors duration-300">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-xl" />
                                    </span>
                                    <span className="text-white group-hover:text-transparent bg-clip-text transition-all duration-300"
                                        style={{ backgroundImage: "linear-gradient(to right, #4285F4 0%, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC05 50%, #FBBC05 75%, #34A853 75%, #34A853 100%)" }}>
                                        {t('footer.sucursal')} {branch.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* COLUMN 2: SÍGUENOS */}
                    <div className="space-y-4 text-center flex flex-col items-center">
                        <h3 className="text-3xl mb-10 font-bold tracking-widest text-white inline-block relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:bg-[#E30613] after:rounded-full">
                            {t('footer.siguenos')}
                        </h3>
                        <div className="flex items-center justify-center">
                            <a
                                href="https://www.instagram.com/donemilio.vm/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-0 text-white transition-all duration-300 transform hover:scale-105 origin-center"
                            >
                                <span className="text-white group-hover:text-[#E1306C] transition-colors duration-300">
                                    <FontAwesomeIcon icon={faInstagram} className="text-3xl" />
                                </span>
                                <span className="text-xl font-bold ml-2 text-white group-hover:text-[#E1306C] transition-colors duration-300">
                                    donemilio.vm
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* COLUMN 3: CONTACTO */}
                    <div className="space-y-4 text-center md:text-right flex flex-col md:items-end">
                        <h3 className="text-3xl mb-10 font-bold tracking-widest text-white inline-block relative after:content-[''] after:absolute after:-bottom-1 after:right-0 after:w-8 after:h-1 after:bg-[#E30613] after:rounded-full">
                            {t('footer.contacto')}
                        </h3>
                        <ul className="space-y-3 text-gray-100 font-bold flex flex-col md:items-end w-full">
                            <li className="flex items-center justify-center md:justify-end gap-3 text-lg group w-full">
                                <a
                                    href="https://wa.me/5493534824646"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 justify-end text-white hover:text-[#25D366] transition-all duration-300 transform hover:scale-105 origin-right"
                                >
                                    <span className="order-1 md:order-2">+54 9 3534 82-4646</span>
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-2xl order-2 md:order-1" />
                                </a>
                            </li>
                            <li className="flex items-center justify-center md:justify-end gap-3 text-lg group w-full">
                                <button
                                    onClick={handleCopyEmail}
                                    className="flex items-center gap-3 justify-end text-white hover:text-[#E1306C] transition-all duration-300 transform hover:scale-105 origin-right relative"
                                    title="Copiar correo"
                                >
                                    <span className="order-1 md:order-2 relative w-full">
                                        <span className={`transition-all duration-300 ${emailCopied ? 'opacity-0' : 'opacity-100'} w-full`}>
                                            recursoshumanos@donemiliosrl.com.ar
                                        </span>
                                        <span className={`absolute inset-0 flex items-center justify-end text-green-400 font-bold transition-all duration-300 ${emailCopied ? 'opacity-100' : 'opacity-0'} text-start w-full`}>
                                            {t('footer.copiado')}
                                        </span>
                                    </span>
                                    <span className="order-2 md:order-1 text-white group-hover:text-[#E1306C] transition-colors">
                                        <FontAwesomeIcon icon={emailCopied ? faCheck : faEnvelope} className="text-xl" />
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-4 pt-4 pb-2 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-gray-400">
                    <p className="text-center md:text-left mb-4 md:mb-0">&copy; {currentYear} {t('footer.copyright')}</p>
                    <div className="flex gap-6 items-center flex-wrap justify-center md:justify-end">
                        <a
                            href="https://portal.grupodonemilio.com:8080/cvs/form"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#E30613] text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-[#E30613] transition-colors font-bold uppercase tracking-wider text-xs shadow-md"
                        >
                            {t('footer.trabajaConNosotros')}
                        </a>
                        <Link to="/contacto" className="hover:text-white transition-colors">
                            {t('footer.linkContacto')}
                        </Link>
                        <Link to="/privacidad" className="hover:text-white transition-colors">
                            {t('footer.privacidad')}
                        </Link>
                        <Link to="/terminos" className="hover:text-white transition-colors">
                            {t('footer.terminos')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
