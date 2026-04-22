import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../api/api'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

/* ── Patrón de fondo con vacas ── */
function CowPattern({ src, bgColor }) {
    const COW_SIZE = 120
    const GAP = 10
    const STEP = COW_SIZE + GAP
    const COLS = 15
    const ROWS = 10
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgColor }}>
            {Array.from({ length: ROWS }).map((_, row) => (
                <div
                    key={row}
                    className="flex"
                    style={{
                        marginLeft: row % 2 === 1 ? -(STEP / 2) : -STEP,
                        gap: GAP,
                        marginBottom: GAP,
                        opacity: 0.6
                    }}
                >
                    {Array.from({ length: COLS }).map((_, col) => (
                        <img key={col} src={src} alt="" draggable={false}
                            style={{ width: COW_SIZE, height: COW_SIZE, objectFit: 'contain', flexShrink: 0, userSelect: 'none' }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

function Home() {
    const { t } = useTranslation()
    const [categories, setCategories] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const fetchAllies = async () => {
            try {
                // VITE_API_URL is typically /api/duyamis
                const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:6500/api/duyamis'
                const apiBaseURL = rawBaseURL.replace(/\/duyamis\/?$/, '')
                const res = await axios.get(`${apiBaseURL}/allies?brand=duyamis`)
                setAllies(res.data)
            } catch (error) {
                console.error('Error fetching allies:', error)
            }
        }
        fetchAllies()
    }, [])

    useEffect(() => {
        fetchCategories().then(data => {
            // Transform for simple use in Home
            setCategories(data.map(cat => ({
                ...cat,
                colors: [{
                    FondoVaquitas: cat.color_fondo_vaquitas,
                    Vaquitas: cat.color_vaquitas,
                    FondoLetras: cat.color_fondo_letras
                }]
            })))
        })
    }, [])

    const nextSlide = useCallback(() => {
        if (categories.length === 0) return
        setCurrentIndex((prev) => prev + 1)
    }, [categories.length])

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [nextSlide])

    if (categories.length === 0) return null

    // Modulo logic for active content based on a constantly increasing index
    const activeIdx = currentIndex % categories.length
    const activeCategory = categories[activeIdx]
    const c = activeCategory.colors?.[0] ?? {}
    const fondoVaquitas = c.FondoVaquitas || '#ffffff'
    const vaquitas = c.Vaquitas || null

    return (
        <main className="flex flex-col min-h-screen bg-white overflow-hidden">
            {/* ── SECCIÓN 1: HERO ── */}
            <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0 scale-105"
                    style={{
                        backgroundImage: 'url("images/navbar/fondo.webp")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center px-4">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white text-xl md:text-3xl font-light tracking-[0.3em] uppercase mb-4 montserrat drop-shadow-lg"
                    >
                        {t('home.somos')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <img
                            src="images/home/logo.webp"
                            alt="Duy Amis Logo"
                            className="w-[280px] md:w-[500px] h-auto object-contain drop-shadow-2xl"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12"
                    >
                        <Link
                            to="/nosotros"
                            className="px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl"
                        >
                            {t('home.conocenos')}
                        </Link>
                    </motion.div>
                </div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-px h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
                </motion.div>
            </section>

            {/* ── SECCIÓN 2: NUESTROS PRODUCTOS (DYNAMICO) ── */}
            <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 py-12 md:py-16">
                {/* Background Layer with AnimatePresence */}
                <AnimatePresence>
                    <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-0"
                    >
                        <CowPattern src={vaquitas} bgColor={fondoVaquitas} />
                        <div className="absolute inset-0 bg-black/10" />
                    </motion.div>
                </AnimatePresence>

                {/* ── CENTRAL WAVY COLUMN ── */}
                {/* We use the same wavy mask logic as in ProductDetail.jsx */}
                {(() => {
                    const WAVE_WIDTH = 12;
                    const WAVE_HEIGHT = 60;
                    const svgWaveLeft = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${WAVE_WIDTH}' height='${WAVE_HEIGHT}' viewBox='0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}'%3E%3Cpath d='M${WAVE_WIDTH},0 L0,0 C0,13.5 ${WAVE_WIDTH},16.5 ${WAVE_WIDTH},30 C${WAVE_WIDTH},43.5 0,46.5 0,60 L${WAVE_WIDTH},60 Z' fill='black'/%3E%3C/svg%3E`;
                    const svgWaveRight = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${WAVE_WIDTH}' height='${WAVE_HEIGHT}' viewBox='0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}'%3E%3Cpath d='M0,0 L${WAVE_WIDTH},0 C${WAVE_WIDTH},13.5 0,16.5 0,30 C0,43.5 ${WAVE_WIDTH},46.5 ${WAVE_WIDTH},60 L0,60 Z' fill='black'/%3E%3C/svg%3E`;

                    // Dynamic background color from brand data
                    const stripBg = activeCategory.colors?.[0]?.FondoLetras || 'rgba(255, 255, 255, 0.5)';

                    return (
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[500px] z-10 transition-all duration-500 pointer-events-none"
                            style={{
                                backgroundColor: stripBg,
                                maskImage: `url("${svgWaveLeft}"), url("${svgWaveRight}"), linear-gradient(black, black)`,
                                maskPosition: 'left top, right top, center top',
                                maskRepeat: 'repeat-y, repeat-y, no-repeat',
                                maskSize: `${WAVE_WIDTH}px ${WAVE_HEIGHT}px, ${WAVE_WIDTH}px ${WAVE_HEIGHT}px, calc(100% - ${WAVE_WIDTH * 2 - 2}px) 100%`,
                                WebkitMaskImage: `url("${svgWaveLeft}"), url("${svgWaveRight}"), linear-gradient(black, black)`,
                                WebkitMaskPosition: 'left top, right top, center top',
                                WebkitMaskRepeat: 'repeat-y, repeat-y, no-repeat',
                                WebkitMaskSize: `${WAVE_WIDTH}px ${WAVE_HEIGHT}px, ${WAVE_WIDTH}px ${WAVE_HEIGHT}px, calc(100% - ${WAVE_WIDTH * 2 - 2}px) 100%`,
                            }}
                        />
                    );
                })()}

                {/* Dynamic Brand Showcase */}
                <div className="relative z-20 w-full flex flex-col items-center flex-1 justify-center">

                    {/* Infinite Horizontal Slider Layout */}
                    <div className="relative w-full h-[250px] md:h-[350px] flex items-center overflow-visible select-none">
                        <motion.div
                            className="flex items-center gap-12 md:gap-24 px-[50vw]"
                            animate={{
                                x: -(currentIndex * (window.innerWidth < 768 ? 200 + 48 : 350 + 96)) - (window.innerWidth < 768 ? 100 : 175)
                            }}
                            transition={{
                                duration: 1.5,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                position: 'absolute',
                                left: 0,
                                willChange: 'transform'
                            }}
                        >
                            {/* Rendering a repeating set of categories to simulate infinite scroll */}
                            {Array.from({ length: 400 }).map((_, totalIdx) => {
                                const catIdx = totalIdx % categories.length
                                const cat = categories[catIdx]
                                const isActive = totalIdx === currentIndex

                                return (
                                    <motion.div
                                        key={`${cat.id}-${totalIdx}`}
                                        animate={{
                                            scale: isActive ? 1.2 : 0.7,
                                            opacity: isActive ? 1 : 0.2,
                                            filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)'
                                        }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="shrink-0 flex flex-col items-center justify-center p-4"
                                        style={{ width: window.innerWidth < 768 ? '200px' : '350px' }}
                                    >
                                        {/* Bare Logo - No container/box as requested */}
                                        <img
                                            src={cat.logo}
                                            alt={cat.name}
                                            className="w-40 md:w-80 h-auto max-h-[150px] md:max-h-[300px] object-contain drop-shadow-xl"
                                            draggable={false}
                                            style={{ filter: isActive ? 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }}
                                        />
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home