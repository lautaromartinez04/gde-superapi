import React, { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import logoDonEmilio from '../media/images/donemilio/donemilio.webp'
import logoDuyAmis from '../media/images/duyamis/duyamis.webp'
import logoMharnes from '../media/images/mharnes/mharnes.webp'
import './about.css'

export const About = ({ onCompanySelect }) => {
    const isMobile = useIsMobile();
    const containerRef = useRef(null)
    const donEmilioMarkRef = useRef(null)
    const duyAmisMarkRef = useRef(null)
    const mharnesMarkRef = useRef(null)

    const [zoomingCompany, setZoomingCompany] = useState(null);
    const [focusingCompany, setFocusingCompany] = useState(null); // New state for blur phase
    const [zoomStyle, setZoomStyle] = useState({ originX: '50%', originY: '50%', transX: '0px', transY: '0px' });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate shadow offset
            const xOffset = (innerWidth / 2 - clientX) / 50;
            const yOffset = (innerHeight / 2 - clientY) / 50;

            if (containerRef.current) {
                containerRef.current.style.setProperty('--shadow-x', `${xOffset}px`);
                containerRef.current.style.setProperty('--shadow-y', `${yOffset}px`);

                if (xOffset < 0) {
                    containerRef.current.classList.add('shadow-left');
                } else {
                    containerRef.current.classList.remove('shadow-left');
                }
            }
        };

        const handlePageShow = (event) => {
            // If the page is restored from bfcache, reset zooming states
            if (event.persisted) {
                setZoomingCompany(null);
                setFocusingCompany(null);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('pageshow', handlePageShow);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    const handleLogoClick = (company) => {
        if (isMobile) {
            if (onCompanySelect) onCompanySelect(company);
            return;
        }

        let targetRef = null;
        if (company === 'donemilio') targetRef = donEmilioMarkRef;
        if (company === 'duyamis') targetRef = duyAmisMarkRef;
        if (company === 'mharnes') targetRef = mharnesMarkRef;

        if (targetRef && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance to center of screen
            const deltaX = (window.innerWidth / 2) - centerX;
            const deltaY = (window.innerHeight / 2) - centerY;

            setZoomStyle({
                originX: `${centerX}px`,
                originY: `${centerY}px`,
                transX: `${deltaX}px`,
                transY: `${deltaY}px`
            });
        }

        // 1. Start Focus Phase (Blur others)
        setFocusingCompany(company);

        // 2. Start Zoom Phase after delay (Wait for border to finish)
        setTimeout(() => {
            setZoomingCompany(company);
        }, 1600); // Increased to 1.6s for slower border

        // 3. Navigate
        setTimeout(() => {
            if (onCompanySelect) onCompanySelect(company);
        }, 3600); // Adjusted total time
    };

    return (
        <section className='about-container' ref={containerRef}>
            <div
                className={`about-background ${zoomingCompany ? 'zooming' : ''} ${focusingCompany ? 'focusing' : ''}`}
                style={{
                    transformOrigin: `${zoomStyle.originX} ${zoomStyle.originY}`,
                    '--tx': zoomStyle.transX,
                    '--ty': zoomStyle.transY
                }}
            ></div>
            <div
                className={`about-content ${zoomingCompany ? 'zooming' : ''} ${focusingCompany ? 'focusing' : ''}`}
                style={{
                    transformOrigin: `${zoomStyle.originX} ${zoomStyle.originY}`,
                    '--tx': zoomStyle.transX,
                    '--ty': zoomStyle.transY
                }}
            >
                <div className='title-content'>
                    <div className='title-container'>
                        <div
                            className={`donemiliomarca ${(zoomingCompany === 'donemilio' || focusingCompany === 'donemilio') ? 'active-mark' : ''}`}
                            ref={donEmilioMarkRef}
                        >
                            <div className="mark-inset-layer"></div>
                        </div>
                        <div
                            className={`duyamismarca ${(zoomingCompany === 'duyamis' || focusingCompany === 'duyamis') ? 'active-mark' : ''}`}
                            ref={duyAmisMarkRef}
                        >
                            <div className="mark-inset-layer"></div>
                        </div>
                        <div
                            className={`mharnesmarca ${(zoomingCompany === 'mharnes' || focusingCompany === 'mharnes') ? 'active-mark' : ''}`}
                            ref={mharnesMarkRef}
                        >
                            <div className="mark-inset-layer"></div>
                        </div>
                        <h2 className='about-title'><span className='grupo-span'>GRUPO</span> <span className='donemilio-span'>DON EMILIO</span></h2>
                    </div>
                    <hr className='about-hr' />
                </div>

                <div className='logos-container'>
                    <img
                        src={logoDonEmilio}
                        alt="Don Emilio"
                        className={`company-logo ${focusingCompany === 'donemilio' ? 'active-logo' : ''}`}
                        onClick={() => handleLogoClick('donemilio')}
                    />
                    <img
                        src={logoDuyAmis}
                        alt="Duy Amis"
                        className={`company-logo ${focusingCompany === 'duyamis' ? 'active-logo' : ''}`}
                        onClick={() => handleLogoClick('duyamis')}
                    />
                    <img
                        src={logoMharnes}
                        alt="Grupo Mharnes"
                        className={`company-logo ${focusingCompany === 'mharnes' ? 'active-logo' : ''}`}
                        onClick={() => handleLogoClick('mharnes')}
                    />
                </div>
            </div>
        </section>
    )
}
