
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'; // Changed faArrowUpAlt to faArrowUp

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = React.useRef(null); // Added useRef hook

    // NEW: Scroll to Top on Route Change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const checkScroll = () => { // Renamed handleScroll to checkScroll
        // 1. Visibility Logic (Keep in React state as it doesn't change on every pixel)
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        // 2. Footer Interaction Logic (Direct DOM manipulation for performance)
        const footer = document.querySelector('footer');
        if (footer && buttonRef.current) { // Check if buttonRef.current exists
            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const distanceToFooter = footerRect.top;

            if (distanceToFooter < viewportHeight) {
                // Footer is visible. Calculate overlap.
                // We want the button to stay above the footer.
                // Distance from bottom of viewport to top of footer = viewportHeight - distanceToFooter
                const overlap = viewportHeight - distanceToFooter;

                // Add default bottom spacing (32px) + overlap
                buttonRef.current.style.bottom = `${32 + overlap}px`;
            } else {
                // Footer not visible, stick to default position
                buttonRef.current.style.bottom = '32px';
            }
        }
    };

    // Scroll smoothly to the top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);
        // Initial check
        checkScroll();

        return () => {
            window.removeEventListener('scroll', checkScroll);
        };
    }, [isVisible]); // Changed dependency array to [isVisible]

    if (!isVisible) return null;

    return (
        <div
            ref={buttonRef} // Added ref to the div
            className="fixed right-8 z-50 transition-transform duration-100 ease-out will-change-transform" // Updated className
            style={{ bottom: '32px' }} // Initial style for bottom
        >
            <button
                onClick={scrollToTop}
                className="group relative bg-[#0033a1] text-white border-2 border-white 
                             p-3 rounded-full shadow-xl overflow-hidden
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E30613]
                             cursor-pointer w-12 h-12 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
                aria-label="Scroll to top"
            >
                {/* Red Hover Fill */}
                <div className="absolute inset-0 bg-[#E30613] transform scale-0 group-hover:scale-150 transition-transform duration-300 ease-in-out rounded-full origin-center"></div>

                {/* Icon */}
                <span className="relative z-10 transition-colors duration-300">
                    <FontAwesomeIcon icon={faAngleUp} className="h-10 w-10" /> {/* Changed faArrowUpAlt to faArrowUp */}
                </span>
            </button>
        </div>
    );
};

export default ScrollToTop;
