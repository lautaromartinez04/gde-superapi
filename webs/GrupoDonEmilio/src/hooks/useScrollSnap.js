import { useEffect, useRef } from 'react';

export const useScrollSnap = () => {
    const animationRef = useRef(null);

    useEffect(() => {
        const handleWheel = (e) => {
            // User interaction detected: ALWAYS cancel any ongoing auto-scroll first.
            // This ensures the user is never "blocked" or fighting the animation.
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }

            // Explicitly target the section containers themselves, not wrappers
            const sections = document.querySelectorAll('.company-section, .about-container');
            if (!sections.length) return;

            const scrollY = window.scrollY;
            const direction = e.deltaY > 0 ? 'down' : 'up';
            const viewportHeight = window.innerHeight;
            // Trigger snap when the top of the section is just barely inside the viewport (visible)
            const threshold = viewportHeight;

            // Find the closest section that we might want to snap to
            let targetSection = null;

            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                const absoluteTop = rect.top + scrollY;

                // 1. Snap to Top (Entering a section)
                if (direction === 'down') {
                    // Check if we are "close" to the top of this section
                    // We only want to snap if the top is currently below the viewport top (rect.top > 0)
                    // and within the threshold
                    if (rect.top > 0 && rect.top < threshold) {
                        targetSection = absoluteTop;
                        break; // Snap to the first one we find
                    }
                }
            }

            if (targetSection !== null) {
                e.preventDefault();

                // Custom Fast Scroll Logic (Inline to access ref)
                const startY = window.scrollY;
                const finalTarget = targetSection;
                const distance = finalTarget - startY;
                const duration = 400; // 500ms duration for "much faster" feel than native
                let startTime = null;

                const step = (currentTime) => {
                    if (!startTime) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);

                    // Easing: easeOutCubic (starts fast, slows down gently)
                    const ease = 1 - Math.pow(1 - progress, 3);

                    window.scrollTo(0, startY + (distance * ease));

                    if (timeElapsed < duration) {
                        animationRef.current = requestAnimationFrame(step);
                    } else {
                        animationRef.current = null;
                    }
                };

                animationRef.current = requestAnimationFrame(step);
            }
        };

        // Passive: false is crucial to be able to preventDefault
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);
};
