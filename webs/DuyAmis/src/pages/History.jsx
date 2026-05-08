import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const History = () => {
    const { t } = useTranslation()
    const historyItems = t('history.items', { returnObjects: true }) || []

    // Respetamos el orden exacto del JSON para que el usuario tenga control manual total
    const timelineSlides = [];
    if (Array.isArray(historyItems)) {
        historyItems.forEach(item => {
            if (item.isImage) {
                // Es una plantilla de imagen manual
                timelineSlides.push({ ...item, slideType: 'image' });
            } else {
                // Es un texto de la historia
                timelineSlides.push({ ...item, slideType: 'text' });
            }
        });
    }

    const targetRef = useRef(null)

    // Calculamos el ancho de cada slide de forma responsiva para que estén más juntos
    const [slideWidth, setSlideWidth] = useState(100);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSlideWidth(100); // En móviles, 100% de la pantalla
            } else if (window.innerWidth < 1024) {
                setSlideWidth(80); // En tablets, 80%
            } else {
                setSlideWidth(60); // En escritorio, 60% (así se ven los de los costados)
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    })

    // El movimiento total ahora depende del ancho del slide
    const totalMove = timelineSlides.length > 0 ? (timelineSlides.length - 1) * slideWidth : 0
    const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${totalMove}vw`])

    return (
        <div className="bg-[#fafafa] relative">
            {/* ── HEADER INTRO ── */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center px-6 relative z-10">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 montserrat uppercase tracking-tighter leading-none drop-shadow-sm">
                        {t('history.title').split(' ')[0]} <span className="text-red-600">{t('history.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto montserrat font-medium">
                        {t('history.subtitle')}
                    </p>
                </motion.div>

                {/* Indicador de Scroll Dinámico */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-16 flex flex-col items-center text-red-600"
                >
                    <span className="montserrat font-bold uppercase tracking-widest text-[10px] mb-4 opacity-50">Haz Scroll</span>
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-[2px] h-12 bg-gradient-to-b from-red-600 to-transparent"
                    ></motion.div>
                </motion.div>
            </div>

            {/* ── SCROLL HORIZONTAL EDITORIAL FLUIDO ── */}
            {/* Aumentamos la altura a 150vh por item para que el usuario tenga que hacer más scroll para moverlo, dándole mucho más control */}
            <section ref={targetRef} className="relative" style={{ height: `${timelineSlides.length * 150}vh` }}>

                {/* Contenedor Sticky Visual */}
                <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-[#fafafa]">
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>

                    {/* Línea horizontal base */}
                    <div className="absolute top-[85%] left-0 w-full h-[1px] bg-gray-300 -translate-y-1/2 z-0 hidden md:block"></div>

                    {/* Línea de progreso interactiva */}
                    <motion.div
                        className="absolute top-[85%] left-0 h-[2px] bg-red-600 -translate-y-1/2 z-10 hidden md:block"
                        style={{
                            width: "100%",
                            scaleX: scrollYProgress,
                            transformOrigin: "left"
                        }}
                    ></motion.div>

                    {/* Riel Horizontal que se mueve */}
                    <motion.div
                        style={{ 
                            x,
                            // Padding para que el primer y último slide queden perfectamente centrados en la pantalla
                            paddingLeft: `${(100 - slideWidth) / 2}vw`,
                            paddingRight: `${(100 - slideWidth) / 2}vw`
                        }}
                        className="flex h-full items-center relative z-20"
                    >
                        {timelineSlides.map((slide, index) => {
                            const isImageSlide = slide.slideType === 'image';

                            return (
                                <div
                                    key={index}
                                    style={{ width: `${slideWidth}vw` }}
                                    className="h-screen flex flex-col justify-center relative flex-shrink-0 pb-[15vh]"
                                >
                                    {/* Año Gigante de Fondo (solo para textos) */}
                                    {!isImageSlide && slide.year && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible">
                                            <span className="text-[25vw] md:text-[20vw] font-black text-gray-900/[0.02] select-none montserrat tracking-tighter leading-none whitespace-nowrap">
                                                {slide.year}
                                            </span>
                                        </div>
                                    )}

                                    {/* Punto conector minimalista */}
                                    <div className="absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 z-30 hidden md:block ring-4 ring-[#fafafa]"></div>

                                    {isImageSlide ? (
                                        /* ── SLIDE DE IMAGEN PURA (Centro de la línea de tiempo) ── */
                                        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 pointer-events-none pt-12 md:pt-0">
                                            <div className="flex flex-col items-center justify-center w-full max-w-[800px] lg:max-w-[1000px] pointer-events-auto">
                                                <div className="relative h-[45vh] md:h-[55vh] w-fit max-w-full overflow-hidden rounded-2xl shadow-xl transition-transform duration-700 hover:scale-[1.02] border border-gray-100 flex items-center justify-center bg-gray-100">
                                                    <img
                                                        src={`${import.meta.env.BASE_URL}images/history/${slide.imageName || slide.year}.webp`}
                                                        alt={slide.text || "Historia Duy Amis"}
                                                        className="h-full w-auto object-cover filter contrast-[1.05] saturate-[0.95]"
                                                        onError={(e) => {
                                                            e.target.src = `https://placehold.co/800x600/f3f4f6/9ca3af?text=Falta+Imagen`;
                                                        }}
                                                    />
                                                </div>
                                                {/* Texto de contexto opcional para la foto */}
                                                {slide.text && (
                                                    <div className="mt-3 md:mt-4 px-4 text-center max-w-4xl mx-auto">
                                                        <p className="text-gray-600 text-lg md:text-xl lg:text-2xl montserrat font-medium leading-relaxed drop-shadow-sm bg-white/60 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none">
                                                            {slide.text}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── SLIDE DE TEXTO (Centro de la línea de tiempo) ── */
                                        <div className="relative z-20 w-full h-full flex flex-col lg:flex-row items-center justify-center px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto pt-16 md:pt-0">

                                            {/* Texto Centrado */}
                                            <div className={`w-full max-w-xl md:max-w-2xl xl:max-w-3xl mx-auto text-center z-20 pointer-events-none transition-all duration-700`}>
                                                <div className="pointer-events-auto">
                                                    <h4 className="text-white font-black text-xl md:text-2xl mb-4 montserrat tracking-widest flex justify-center">
                                                        <span className="p-1 pl-2 rounded-full bg-red-600 ring ring-black shadow-lg">
                                                            {slide.year}
                                                        </span>
                                                    </h4>

                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-red-600 mb-6 montserrat uppercase tracking-tighter leading-tight drop-shadow-sm">
                                                        {slide.title}
                                                    </h3>

                                                    <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed montserrat font-medium drop-shadow-sm bg-white/60 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none">
                                                        {slide.description}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER DE CIERRE ── */}
            <section className="h-screen w-full snap-start bg-gray-900 flex flex-col justify-center items-center relative overflow-hidden text-center px-6">
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <img
                        src={`${import.meta.env.BASE_URL}images/navbar/duyamis.webp`}
                        alt="Duy Amis Logo"
                        className="h-24 md:h-32 object-contain mb-10 opacity-80 brightness-0 invert"
                    />

                    <h2 className="text-4xl md:text-6xl font-black text-white montserrat uppercase tracking-tighter leading-none mb-6">
                        El Legado <span className="text-red-500">Continúa</span>
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl montserrat max-w-xl mx-auto font-light tracking-wide">
                        Escribimos nuestra historia todos los días, con la misma pasión de nuestro primer paso.
                    </p>
                </motion.div>
            </section>
        </div>
    )
}

export default History
