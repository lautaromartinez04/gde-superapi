import { useState, useEffect, useRef } from 'react';
import i18n from '../../hooks/i18next';

export default function LanguageToggle() {
    const [lang, setLang] = useState('es');
    const buttonRef = useRef(null);

    const toggle = () => {
        const next = lang === 'es' ? 'en' : 'es';
        i18n.changeLanguage(next);
        setLang(next);
    };

    useEffect(() => {
        const DEFAULT_BOTTOM = 20; // px — margen normal (2.5vh ~ 20px)
        const DEFAULT_LEFT = 20;

        const handleScroll = () => {
            if (!buttonRef.current) return;

            // Si estamos en la cima, posición por defecto siempre
            if (window.scrollY === 0) {
                buttonRef.current.style.bottom = `${DEFAULT_BOTTOM}px`;
                return;
            }

            const footer = document.querySelector('footer');
            if (!footer) {
                buttonRef.current.style.bottom = `${DEFAULT_BOTTOM}px`;
                return;
            }

            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (footerRect.top < viewportHeight) {
                // Footer visible → empujar el botón hacia arriba
                const overlap = viewportHeight - footerRect.top;
                buttonRef.current.style.bottom = `${DEFAULT_BOTTOM + overlap}px`;
            } else {
                buttonRef.current.style.bottom = `${DEFAULT_BOTTOM}px`;
            }
        };

        // Posición inicial
        buttonRef.current && (buttonRef.current.style.left = `${DEFAULT_LEFT}px`);
        // Esperar al primer paint antes de calcular la posición del footer
        const raf = requestAnimationFrame(handleScroll);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={toggle}
            aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1010,
                backgroundColor: '#ffffff',
                border: '1px solid #0033a1',
                color: '#0033a1',
                fontWeight: 'bold',
                padding: '6px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                transition: 'none',
            }}
        >
            <i className="fa-solid fa-language" style={{ fontSize: '16px' }} />
            {lang === 'es' ? 'Es' : 'En'}
        </button>
    );
}
