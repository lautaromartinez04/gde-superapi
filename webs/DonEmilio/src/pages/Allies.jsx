import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import carrito from '../media/images/schedules/carrito.webp';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL.endsWith('/') ? import.meta.env.VITE_API_URL.slice(0, -1) : import.meta.env.VITE_API_URL) : '';

const CartPattern = ({ isBlue }) => (
    <div className={`absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] ${isBlue ? 'opacity-[0.20]' : 'opacity-[0.1]'}`}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="blueTint">
                    <feColorMatrix type="matrix" values="
                        0 0 0 0 0
                        0 0 0 0 0.2
                        0 0 0 0 0.63
                        0 0 0 1 0" />
                </filter>
                <pattern id={isBlue ? "logoCartPatternBlue" : "logoCartPattern"} width="80" height="80" patternUnits="userSpaceOnUse">
                    <image href={carrito} x="10" y="10" width="60" height="60" preserveAspectRatio="xMidYMid meet" filter={isBlue ? "url(#blueTint)" : ""} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${isBlue ? 'logoCartPatternBlue' : 'logoCartPattern'})`} />
        </svg>
    </div>
);

const SplitContactButton = () => {
    const { t } = useTranslation();
    const [emailCopied, setEmailCopied] = useState(false);

    const handleCopyEmail = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('lautarom403@gmail.com');
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    return (
        <div className="relative w-[280px] h-[60px] mx-auto group perspective-1000 z-20 cursor-pointer">
            {/* Contáctanos base layer */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#E30613] text-white font-bold text-lg rounded-full shadow-[0_10px_20px_-5px_rgba(227,6,19,0.4)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-0 group-hover:scale-90 z-10 group-hover:pointer-events-none">
                {t('aliados.contactanos')}
            </div>

            {/* Split halves container */}
            <div className="absolute inset-0 flex justify-between gap-3 z-0 pointer-events-none group-hover:pointer-events-auto group-hover:z-20">
                {/* Email - copies to clipboard */}
                <button
                    onClick={handleCopyEmail}
                    className={`flex-1 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform -translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-out hover:!flex-[1.8] shadow-lg cursor-pointer overflow-hidden ${emailCopied ? 'bg-green-500' : 'bg-[#0033a1]'}`}
                    title={emailCopied ? '¡Copiado!' : 'Copiar email'}
                >
                    <FontAwesomeIcon
                        icon={emailCopied ? faCheck : faEnvelope}
                        className="text-[1.4rem] flex-shrink-0"
                    />
                </button>
                {/* WhatsApp */}
                <a
                    href="https://wa.me/5493534824646"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#25D366] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-out hover:!flex-[1.8] shadow-lg cursor-pointer overflow-hidden"
                    title="WhatsApp"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                </a>

                <NavLink
                    to="/contacto"
                    className="flex-1 bg-[#0033a1] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-out hover:!flex-[1.8] shadow-lg cursor-pointer overflow-hidden"
                    title="Contacto"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </NavLink>

            </div>
        </div>
    );
};

const Allies = () => {
    const { t } = useTranslation();
    const parentRef = useRef(null);
    const ctaRef = useRef(null);
    const [syncPos, setSyncPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const [partners, setPartners] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        const fetchAllies = async () => {
            try {
                const res = await axios.get(`${API_BASE}/allies?brand=donemilio`, {
                    headers: {
                        'x-api-key': `<Donemilio@2026>`
                    }
                });
                setPartners(res.data);
            } catch (error) {
                console.error('Error fetching allies:', error);
            }
        };
        fetchAllies();
    }, []);

    useEffect(() => {
        const updatePos = () => {
            if (parentRef.current && ctaRef.current) {
                const parentRect = parentRef.current.getBoundingClientRect();
                const ctaRect = ctaRef.current.getBoundingClientRect();
                setSyncPos({
                    x: ctaRect.left - parentRect.left,
                    y: ctaRect.top - parentRect.top,
                    w: parentRect.width,
                    h: parentRect.height
                });
            }
        };

        updatePos();
        window.addEventListener('resize', updatePos);
        const timeoutId = setTimeout(updatePos, 100);

        return () => {
            window.removeEventListener('resize', updatePos);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div ref={parentRef} className="relative min-h-screen bg-[#0033a1] pt-10 pb-12 font-tommy selection:bg-white selection:text-[#0033a1] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <CartPattern isBlue={false} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16 flex flex-col items-center justify-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                        {t('aliados.titulo')}
                    </h1>
                    <div className="w-24 h-1.5 bg-red-600 rounded-full mb-8"></div>
                    <p className="max-w-2xl text-lg sm:text-xl text-blue-50 font-light leading-relaxed drop-shadow-md">
                        {t('aliados.descripcion')}
                    </p>
                </div>

                {/* Image Cards Section */}
                <div className="flex flex-col gap-12 sm:gap-20 perspective-1000">
                    {Array.isArray(partners) && partners.map((partner, index) => {
                        const CardWrapper = partner.website_url ? 'a' : 'div';
                        const cardProps = partner.website_url
                            ? { href: partner.website_url, target: '_blank', rel: 'noopener noreferrer' }
                            : {};
                        const isLoaded = loadedImages[partner.id];
                        return (
                            <CardWrapper
                                key={index}
                                {...cardProps}
                                className="group relative rounded-3xl sm:rounded-[2.5rem] bg-white bg-opacity-90 backdrop-blur-lg border border-white/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] transition-all duration-700 hover:-translate-y-3 overflow-hidden cursor-pointer block"
                            >
                                {/* Inner Glass border reflex */}
                                <div className="absolute inset-0 border-[2px] border-white/60 rounded-3xl sm:rounded-[2.5rem] pointer-events-none z-20 mix-blend-overlay"></div>

                                {/* Animated Shine Effect */}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:animate-shine pointer-events-none"></div>

                                {/* Images Container */}
                                <div className="relative w-full overflow-hidden bg-white flex items-center justify-center">
                                    {/* Skeleton pulsante mientras carga */}
                                    {!isLoaded && (
                                        <div className="w-full bg-blue-50 animate-pulse" style={{ aspectRatio: '16/5' }} />
                                    )}
                                    {/* Full Image */}
                                    <img
                                        src={partner.image_url}
                                        alt={`${partner.name} - Logo`}
                                        onLoad={() => handleImageLoad(partner.id)}
                                        className={`w-full h-auto object-cover transform group-hover:scale-[1.03] transition-all duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                                    />

                                    {/* Overlay Shadow for Depth */}
                                    <div className="absolute inset-0 shadow-[inset_0_-30px_60px_-15px_rgba(0,0,0,0.1)] pointer-events-none mix-blend-multiply"></div>
                                </div>
                            </CardWrapper>
                        );
                    })}
                </div>

                {/* Call to Action Note */}
                <div ref={ctaRef} className="mt-28 text-center bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden border border-gray-200">

                    {/* Synchronized Blue Pattern Background */}
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2.5rem]">
                        {(syncPos.w > 0) && (
                            <div
                                className="absolute"
                                style={{
                                    top: -syncPos.y,
                                    left: -syncPos.x,
                                    width: syncPos.w,
                                    height: syncPos.h
                                }}
                            >
                                <CartPattern isBlue={true} />
                            </div>
                        )}
                    </div>

                    {/* Content inside CTA Box */}
                    <div className="relative z-10 p-8 sm:p-14">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#0033a1] opacity-5 rounded-full blur-[80px] -z-10"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-red-600 opacity-5 rounded-full blur-[80px] -z-10"></div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-[#0033a1] mb-3 drop-shadow-sm">
                            {t('aliados.formaparte')}
                        </h2>
                        <div className="w-16 h-1 bg-red-600 rounded-full mb-3 mx-auto"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-4 text-lg sm:text-2xl font-medium">
                            {t('aliados.si sos')} <span className="text-[#0033a1] font-bold inline-block">DON EMILIO</span>, <br /> {t('aliados.asesoramos')}
                        </p>
                        <SplitContactButton />
                    </div>
                </div>
            </div>

            {/* Tailwind Extensions (Inline style for Keyframes if needed) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shine {
                    100% { left: 125%; }
                }
                .animate-shine {
                    animation: shine 1.5s ease-in-out;
                }
            `}} />
        </div>
    );
};

export default Allies;
