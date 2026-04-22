import { useState, useEffect, useRef } from 'react';
import i18n from '../../hooks/i18next';

export default function LanguageToggle() {
    const [lang, setLang] = useState('es');
    const [hovered, setHovered] = useState(false);
    const buttonRef = useRef(null);

    const toggle = () => {
        const next = lang === 'es' ? 'en' : 'es';
        i18n.changeLanguage(next);
        setLang(next);
    };

    useEffect(() => {
        const DEFAULT_BOTTOM = 20; // px

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
                const overlap = viewportHeight - footerRect.top;
                buttonRef.current.style.bottom = `${DEFAULT_BOTTOM + overlap}px`;
            } else {
                buttonRef.current.style.bottom = `${DEFAULT_BOTTOM}px`;
            }
        };

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
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1010,
                backgroundColor: hovered ? '#e32515' : '#ffffff',
                border: '1.5px solid #e32515',
                color: hovered ? '#ffffff' : '#e32515',
                fontWeight: 'bold',
                padding: '7px 16px',
                borderRadius: '999px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                transition: 'background-color 0.25s ease, color 0.25s ease',
                boxShadow: hovered
                    ? '0 4px 16px rgba(227,37,21,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                fontFamily: 'Montserrat, sans-serif',
            }}
        >
            <i className="fa-solid fa-language" style={{ fontSize: '16px' }} />
            {lang === 'es' ? 'Es' : 'En'}
        </button>
    );
}
