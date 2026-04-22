import { useState, useEffect } from 'react';

export const useScrollProgress = (ref) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Calculate how far we've scrolled into the element
            // We want progress 0 when top of element hits top of viewport
            // And progress 1 when bottom of element hits bottom of viewport (end of sticky)

            // Actually, for a sticky container:
            // The container is usually taller than viewport (e.g. 300vh).
            // We want to track the scroll position relative to when it enters view.

            // We want 0 to 1 as we scrolling DOWN through the element.
            // When rect.top is 0, we are at start.
            // When rect.bottom is viewportHeight, we are at end.

            // Distance scrolled = -rect.top (since it goes negative as we scroll down)
            // Total scrollable distance = elementHeight - viewportHeight

            const totalScrollable = elementHeight - viewportHeight;
            let currentProgress = -rect.top / totalScrollable;

            // Clamp between 0 and 1
            currentProgress = Math.max(0, Math.min(1, currentProgress));

            setProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref]);

    return progress;
};
