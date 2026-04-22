import { useEffect, useRef } from 'react';

export const useMouseShadow = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let animationFrameId;

        const handleMouseMove = (e) => {
            if (!containerRef.current) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate shadow offset: light follows mouse, shadow moves opposite
            const xOffset = (innerWidth / 2 - clientX) / 50;
            const yOffset = (innerHeight / 2 - clientY) / 50;

            // Use requestAnimationFrame for smooth performance
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                if (containerRef.current) {
                    containerRef.current.style.setProperty('--shadow-x', `${xOffset}px`);
                    containerRef.current.style.setProperty('--shadow-y', `${yOffset}px`);
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return containerRef;
};
