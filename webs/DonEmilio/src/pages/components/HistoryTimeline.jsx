import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import carrito from "../../media/images/schedules/carrito.webp";

const RollingDigit = ({ value }) => {
    // A long strip of digits to allow continuous scrolling without "snapping" back from 9 to 0
    const digits = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ];
    const offset = 20; // Center the initial range

    return (
        <div className="relative w-[1ch] h-16 md:h-32 text-5xl md:text-9xl overflow-hidden flex justify-center items-center">
            <motion.div
                animate={{ y: `-${((value + offset) * 100) / digits.length}%` }}
                transition={{ duration: 0 }} // Follow parent animate exactly
                className="absolute top-0 left-0 right-0 flex flex-col items-center"
            >
                {digits.map((n, i) => (
                    <span key={i} className="flex items-center justify-center h-16 md:h-32 font-bold text-white/25 select-none leading-none">
                        {n}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const YearCounter = ({ targetYear, data }) => {
    const [displayValue, setDisplayValue] = useState(parseInt(targetYear, 10));
    const prevValueRef = React.useRef(parseInt(targetYear, 10));

    // Use the first year as a stable base for continuous displacement
    const baseYear = parseInt(data[0].year, 10);

    useEffect(() => {
        const endValue = parseInt(targetYear, 10);
        if (prevValueRef.current === endValue) return;

        const controls = animate(prevValueRef.current, endValue, {
            duration: 1.2,
            ease: "easeInOut",
            onUpdate: (latest) => {
                setDisplayValue(latest);
                prevValueRef.current = latest;
            },
        });

        return () => controls.stop();
    }, [targetYear]);

    // Mechanical "carry" logic + Continuous displacement
    const getDigitValue = (val, factor) => {
        const baseDigitValue = Math.floor(baseYear / factor);
        const currentDigitValue = Math.floor(val / factor);
        const baseDigit = baseDigitValue % 10;

        const floorDisplacement = currentDigitValue - baseDigitValue;

        if (factor === 1) {
            // Ones roll linearly
            return baseDigit + (val - baseYear);
        }

        // Higher digits only roll when the total remainder to the right is > (factor - 1)
        const remainder = val % factor;
        const threshold = factor - 1;
        const roll = remainder > threshold ? (remainder - threshold) : 0;

        return baseDigit + floorDisplacement + roll;
    };

    return (
        <div className="flex tabular-nums items-center">
            <RollingDigit value={getDigitValue(displayValue, 1000)} />
            <RollingDigit value={getDigitValue(displayValue, 100)} />
            <RollingDigit value={getDigitValue(displayValue, 10)} />
            <RollingDigit value={getDigitValue(displayValue, 1)} />
        </div>
    );
};

const HistoryTimeline = ({ data }) => {
    // Start with activeIndex 0
    const [activeIndex, setActiveIndex] = useState(0);

    const paginate = (newIndex) => {
        setActiveIndex(newIndex);
    };


    // Scroll (Wheel) Handler
    useEffect(() => {
        let lastScrollTime = 0;
        const handleWheel = (e) => {
            // Prevent default scrolling of the page
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime < 500) return; // Throttle scroll (500ms)

            if (e.deltaY > 0) {
                // Scroll Down -> Next
                if (activeIndex < data.length - 1) {
                    paginate(activeIndex + 1);
                    lastScrollTime = now;
                }
            } else {
                // Scroll Up -> Prev
                if (activeIndex > 0) {
                    paginate(activeIndex - 1);
                    lastScrollTime = now;
                }
            }
        };

        const container = document.getElementById('timeline-container');
        if (container) {
            // Use passive: false to allow preventDefault()
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [activeIndex, data.length]); // Re-bind when activeIndex changes to get fresh state

    // Touch / Swipe Handler
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && activeIndex < data.length - 1) {
            // Swipe Left -> Next
            paginate(activeIndex + 1);
        }
        if (isRightSwipe && activeIndex > 0) {
            // Swipe Right -> Prev
            paginate(activeIndex - 1);
        }
    };


    return (
        <section
            id="timeline-container"
            className="relative h-full bg-black flex flex-col overflow-hidden font-tommy touch-none overscroll-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >

            {/* BACKGROUND IMAGE SLIDER */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src={data[activeIndex].image || carrito}
                            alt=""
                            className="w-full h-full object-cover opacity-60"
                        />
                        {/* Gradient Overlay for Text Readability - Attached to Image for sliding together */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0033a1]/90 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">

                {/* BACKGROUND YEAR NUMBER (Top Right) */}
                <div className="absolute top-4 right-4 md:top-12 md:right-12 pointer-events-none z-0 h-16 md:h-32 flex justify-end items-center">
                    <YearCounter targetYear={data[activeIndex].year} data={data} />
                </div>

                {/* INTEGRATED TEXT INFO */}
                <div className="flex-1 flex w-[100%] items-center px-6 md:px-24 pointer-events-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="relative max-w-2xl text-left w-[100%] z-10"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg relative">
                                {data[activeIndex].title}
                            </h2>
                            <div className="h-1.5 w-16 md:w-24 bg-[#E30613] mb-4 md:mb-6 rounded-full shadow-lg"></div>
                            <p className="text-lg md:text-2xl text-gray-100 leading-relaxed font-light drop-shadow-md">
                                {data[activeIndex].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* BOTTOM TRACK */}
                <div className="relative h-[25%] w-full flex items-center justify-center pointer-events-auto">
                    <div className="relative w-full max-w-7xl mx-auto px-6 md:px-20 h-full flex items-center">

                        {/* The Main Line Background */}
                        <div className="absolute top-1/2 left-8 right-8 md:left-20 md:right-20 h-1 md:h-2 bg-white/30 -translate-y-1/2 rounded-full z-0 backdrop-blur-sm"></div>
                        {/* Active Progress Line */}
                        <div className="absolute top-1/2 left-8 right-8 md:left-20 md:right-20 h-1 md:h-2 bg-white -translate-y-1/2 rounded-full z-0 opacity-10"></div>

                        {/* Main Interactive Container - Absolute to match lines perfectly */}
                        <div className="absolute top-0 left-8 right-8 md:left-20 md:right-20 h-full z-10 pointer-events-none">
                            {data.map((item, index) => {
                                // Calculate position exactly as the moving marker does
                                const leftPosition = `${(index / (data.length - 1)) * 100}%`;

                                return (
                                    <div
                                        key={index}
                                        className="absolute top-0 h-full flex flex-col items-center justify-center group pointer-events-none"
                                        style={{ left: leftPosition, transform: 'translateX(-50%)' }}
                                    >

                                        {/* Marker on Line (Always Inactive Style as background) - Centered vertically */}
                                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 rounded-full border-4 bg-white border-white/50 z-20 transition-all duration-300"></div>

                                        {/* Year (Below) - HIDDEN ON MOBILE to prevent crowding */}
                                        <div className={`hidden md:block absolute top-[63%] mt-2 md:mt-4 transition-all duration-300 text-sm md:text-lg font-bold ${index === activeIndex ? 'text-white' : 'text-white/70'}`}>
                                            {item.year}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        {/* The Moving Active Marker (Red Circle with Cart Inside) */}
                        <div className="absolute top-1/2 left-8 right-8 md:left-20 md:right-20 h-0 z-30 pointer-events-none">
                            <motion.div
                                className="absolute top-1/2 w-8 h-8 md:w-16 md:h-16 z-50 transform-gpu bg-[#E30613] rounded-full border-2 md:border-4 border-white shadow-[0_0_15px_rgba(227,6,19,0.5)] flex items-center justify-center"
                                style={{ x: '-50%', y: '-50%' }} // Centered on line
                                animate={{
                                    left: `${(activeIndex / (data.length - 1)) * 100}%`
                                }}
                                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            >
                                <img
                                    src={carrito}
                                    alt="Carrito"
                                    className="w-3/4 h-3/4 object-contain filter drop-shadow-sm"
                                />
                            </motion.div>
                        </div>

                    </div>
                </div>

            </div>

        </section >
    );
};

export default HistoryTimeline;
