import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchAllData } from '../api/api'
import { useTranslation } from 'react-i18next'

/* ─── helpers ─── */
function isImagePath(val) {
    return typeof val === 'string' && (val.startsWith('/') || val.startsWith('http'))
}


/* ─── Patrón de vacas con alineación vertical entre secciones ─── */
function CowPattern({ src, bgColor, topOffset = 0 }) {
    const COW_SIZE = 120
    const GAP = 10
    const STEP = COW_SIZE + GAP
    const COLS = 20
    const ROWS = 15        // filas extra para cubrir el desfase
    const opacity = 0.7

    // Desfase vertical: cuantos px dentro del tile empieza esta sección
    const phase = topOffset % STEP

    return (
        <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgColor }}>
            <div style={{ marginTop: -phase }}>
                {Array.from({ length: ROWS }).map((_, row) => (
                    <div
                        key={row}
                        className="flex"
                        style={{
                            marginLeft: ((row + Math.floor(topOffset / STEP)) % 2 === 1) ? -(STEP / 2) : -STEP,
                            gap: GAP,
                            marginBottom: GAP,
                            opacity,
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
        </div>
    )
}

/* ─── Card de producto: imagen + hover reveal ─── */
function ProductCard({ product, categoryIndex, colors }) {
    const letrasLogo = colors?.LetrasLogo || '#111827'
    const width = product.width || '25%'
    const nombreYpeso = colors?.nombreypeso || '#111827'

    const handleClick = () => {
        sessionStorage.setItem('productsScrollY', window.scrollY)
    }

    return (
        <Link
            to={`/producto/${categoryIndex}/${product.id}`}
            onClick={handleClick}
            className="relative overflow-hidden group flex justify-center flex-col items-center w-1/2 sm:w-1/3 md:w-1/4 px-2 md:px-4 shrink-0"
        >
            {/* Imagen directa, sin card */}
            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                    style={{ width }}

                />
            ) : (
                <div className="w-full flex items-center justify-center">
                    <svg className="w-16 h-16 opacity-20" viewBox="0 0 24 24" fill="none" stroke={letrasLogo} strokeWidth={1.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />

                    </svg>
                </div>
            )}

            <div
                className="text-center pt-2 md:pt-4 pb-1 opacity-100 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out"
            >
                <p className="text-xs md:text-sm font-extrabold leading-tight wardrum" style={{ color: nombreYpeso, textShadow: `0 1px 3px rgba(0,0,0)` }}>
                    {product.name}
                </p>
                <p className="text-base md:text-lg font-semibold mt-0.5 wardrum" style={{ color: nombreYpeso, textShadow: `0 1px 3px rgba(0,0,0)` }}>
                    {product.quantity}
                </p>
            </div>
        </Link>
    )
}

/* ─── Sección de categoría ─── */
function CategorySection({ category, categoryIndex, topOffset = 0, sectionRef, isLast }) {
    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState(false)
    const localRef = useRef(null)

    const c = category.colors?.[0] ?? {}
    const fondoVaquitas = c.FondoVaquitas || '#f3f4f6'
    const vaquitas = c.Vaquitas || null
    const firma = c.Firma || '#374151'
    const cantprod = c.cantprod || '#374151'
    const fondocantprod = c.fondocantprod || '#374151'

    const vacaIsImage = isImagePath(vaquitas)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '400px' } // Load content slightly before it enters the viewport
        )

        if (localRef.current) observer.observe(localRef.current)
        return () => observer.disconnect()
    }, [])

    const waveEncoded = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='black'/%3E%3C/svg%3E`;

    const maskStyles = isLast ? {} : {
        WebkitMaskImage: `linear-gradient(black, black), url("${waveEncoded}")`,
        WebkitMaskPosition: 'top center, bottom center',
        WebkitMaskSize: '100% calc(100% - 59px), 100% 60px',
        WebkitMaskRepeat: 'no-repeat, no-repeat',
        maskImage: `linear-gradient(black, black), url("${waveEncoded}")`,
        maskPosition: 'top center, bottom center',
        maskSize: '100% calc(100% - 59px), 100% 60px',
        maskRepeat: 'no-repeat, no-repeat',
    };

    return (
        <section
            ref={(el) => {
                localRef.current = el
                if (sectionRef) sectionRef(el)
            }}
            className="relative overflow-hidden min-h-[400px]"
            style={{
                backgroundColor: fondoVaquitas,
                paddingBottom: isLast ? '0px' : '60px',
                ...maskStyles
            }}
        >

            {/* Patrón de vacas cubre toda la sección */}
            {isVisible && vacaIsImage && (
                <CowPattern src={vaquitas} bgColor={fondoVaquitas} topOffset={topOffset} />
            )}

            {!vacaIsImage && (
                <div className="absolute inset-0 z-0" style={{ backgroundColor: fondoVaquitas }} />
            )}

            {/* ── Header: logo de categoría ── */}
            <div className={`relative z-10 flex flex-col items-center justify-center ${categoryIndex > 0 ? 'pt-[100px] md:pt-[120px]' : 'pt-10 md:pt-16'} pb-6 md:pb-8`}>
                {category.logo && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                        className="rounded-[2rem] md:rounded-[3rem] px-8 md:px-12 py-4 md:py-6 flex flex-col items-center justify-center mb-4 md:mb-6 z-20"
                        style={{
                            backgroundColor: c.fondologo,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            border: `4px solid ${firma}`
                        }}
                    >
                        <img
                            src={category.logo}
                            alt={category.name}
                            loading="lazy"
                            className="h-16 md:h-28 w-auto object-contain"
                            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                        />
                    </motion.div>
                )}
                <div
                    className="px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-md backdrop-blur-sm"
                    style={{ backgroundColor: `${fondocantprod}dd` }}
                >
                    <p
                        className="text-[10px] pt-0.5 md:text-xs font-black uppercase tracking-widest wardrum"
                        style={{ color: cantprod, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                        {category.products.length} {t('productos.presentaciones')}
                    </p>
                </div>
            </div>

            {/* ── Grid de productos: flex centrado, space-between visual ── */}
            <div className="relative z-10 flex flex-wrap justify-center gap-y-10 md:gap-y-12 px-2 md:px-4 pb-10">
                {isVisible && category.products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        categoryIndex={categoryIndex}
                        colors={c}
                    />
                ))}
            </div>

        </section>
    )
}

/* ─── Products ─── */
function Products() {
    const { t } = useTranslation()
    const [categoriesData, setCategoriesData] = useState([])
    const sectionRefs = useRef([])
    const [offsets, setOffsets] = useState([])

    useEffect(() => {
        fetchAllData().then(data => {
            setCategoriesData(data.Categories)
            setOffsets(Array(data.Categories.length).fill(0))
        })
    }, [])

    useLayoutEffect(() => {
        if (categoriesData.length === 0) return
        // Calcula el offset acumulativo de cada sección teniendo en cuenta el overlap visual
        let cumulative = 0
        const next = categoriesData.map((_, i) => {
            const height = sectionRefs.current[i]?.getBoundingClientRect().height ?? 0
            const off = cumulative
            cumulative += height - (i < categoriesData.length - 1 ? 60 : 0)
            return off
        })
        setOffsets(next)
    }, [categoriesData])

    useEffect(() => {
        const savedScroll = sessionStorage.getItem('productsScrollY')
        if (savedScroll) {
            // A small timeout ensures the layout calculation is complete
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(savedScroll, 10))
            })
            sessionStorage.removeItem('productsScrollY')
        }
    }, [])

    if (categoriesData.length === 0 || offsets.length === 0) return <div className="min-h-screen bg-white" />

    return (
        <main>
            {categoriesData.map((category, idx) => {
                const isLast = idx === categoriesData.length - 1;
                return (
                    <div
                        key={`${category.id}-${idx}`}
                        className="relative"
                        style={{
                            zIndex: categoriesData.length - idx,
                            marginTop: idx === 0 ? 0 : '-60px',
                            filter: isLast ? 'none' : 'drop-shadow(0px 8px 6px rgba(0,0,0,0.2))'
                        }}
                    >
                        <CategorySection
                            category={category}
                            categoryIndex={idx}
                            topOffset={offsets[idx]}
                            sectionRef={el => sectionRefs.current[idx] = el}
                            isLast={isLast}
                        />
                    </div>
                )
            })}
        </main>
    )
}

export default Products
