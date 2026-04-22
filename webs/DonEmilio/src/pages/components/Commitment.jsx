import React, { useEffect, useRef, useState } from 'react';
import pasillos from '../../media/images/commitment/pasillos.webp';
import { useTranslation } from 'react-i18next';

export const Commitment = () => {
    const { t } = useTranslation();
    const textRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
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

    return (
        <div
            className="relative bg-fixed bg-center bg-cover py-32 px-4 font-tommy overflow-hidden"
            style={{ backgroundImage: `url(${pasillos})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <p
                    ref={textRef}
                    className={`text-2xl md:text-4xl text-white [text-shadow:_0px_3px_0px_black] font-bold leading-tight drop-shadow-xl transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <span className="font-bold text-[#0033a1] "></span>{t('inicio.texto1')}
                </p>
            </div>
        </div>
    );
};
