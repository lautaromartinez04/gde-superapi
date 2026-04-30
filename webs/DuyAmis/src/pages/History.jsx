import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const History = () => {
    const { t } = useTranslation()

    // Obtenemos los items de la historia desde las traducciones
    const historyItems = t('history.items', { returnObjects: true })

    return (
        <div className="min-h-screen bg-[#fafafa] relative">
            {/* ── BACKGROUND DEPTH ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>
                
                {/* Large Background Cow (Watermark) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 0.04, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute -right-1/4 top-1/4 w-[80%] h-full"
                >
                    <img 
                        src={`${import.meta.env.BASE_URL}images/about/vaca.webp`} 
                        alt="" 
                        className="w-full h-full object-contain grayscale rotate-12"
                    />
                </motion.div>

                {/* Another watermark on the left */}
                <div className="absolute -left-1/4 bottom-0 w-[60%] h-[60%] opacity-[0.02]">
                    <img 
                        src={`${import.meta.env.BASE_URL}images/about/vaca.webp`} 
                        alt="" 
                        className="w-full h-full object-contain grayscale -rotate-12 scale-x-[-1]"
                    />
                </div>
            </div>

            <div className="relative z-10">
                {/* ── HEADER SECTION ── */}
                <header className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 montserrat uppercase tracking-tighter leading-none">
                            {t('history.title').split(' ')[0]} <br className="md:hidden" />
                            <span className="text-red-600">{t('history.title').split(' ')[1]}</span>
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto montserrat font-medium">
                            {t('history.subtitle')}
                        </p>
                    </motion.div>

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.08]">
                        <img 
                            src={`${import.meta.env.BASE_URL}images/about/vaca.webp`} 
                            alt="" 
                            className="w-full h-full object-contain scale-150 rotate-12"
                        />
                    </div>
                </header>

                {/* ── TIMELINE SECTION ── */}
                <section className="relative py-12 pb-48 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative">
                        
                        {/* Vertical Line (Double Width: 4px) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-600 hidden md:block z-0"></div>
                        <div className="absolute left-6 transform -translate-x-1/2 w-1 h-full bg-red-600 md:hidden z-0"></div>

                        <div className="space-y-20 md:space-y-32">
                            {Array.isArray(historyItems) && historyItems.map((item, index) => {
                                const isTextOnly = item.noImage === true;

                                return (
                                    <div key={index} className="relative flex flex-col items-center justify-center">
                                        
                                        {/* Year Marker */}
                                        <motion.div 
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className={`absolute left-6 md:left-1/2 transform -translate-x-1/2 z-50 ${isTextOnly ? '-top-10' : 'top-0 md:top-1/2 md:-translate-y-1/2'}`}
                                        >
                                            <div className="bg-white border-2 border-red-600 text-red-600 font-black w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0px_10px_30px_rgba(227,37,21,0.1)] montserrat text-xs md:text-base tracking-tighter">
                                                {item.year}
                                            </div>
                                        </motion.div>

                                        {isTextOnly ? (
                                            /* ── CASE: NO IMAGE (Elegant Wavy Brackets) ── */
                                            <div className="relative w-full flex flex-col items-center py-10 z-20">
                                                
                                                {/* ONLY block the center area to allow line to enter top and exit bottom */}
                                                <div className="absolute top-14 bottom-14 w-2 bg-[#fafafa] left-1/2 -translate-x-1/2 hidden md:block z-10"></div>

                                                {/* Top Bracket SVG */}
                                                <div className="w-full max-w-xl h-20 -mb-1 relative z-30">
                                                    <svg width="100%" height="100%" viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                                        <path d="M200 0C200 25 180 30 160 30H20C10 30 0 35 0 50" stroke="#dc2626" strokeWidth="2" />
                                                        <path d="M200 0C200 25 220 30 240 30H380C390 30 400 35 400 50" stroke="#dc2626" strokeWidth="2" />
                                                    </svg>
                                                </div>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    className="w-full max-w-xl px-0 relative z-30"
                                                >
                                                    {/* Card with SOLID background */}
                                                    <div className="px-8 md:px-14 py-8 text-center relative bg-[#fafafa] rounded-[3rem]">
                                                        <h3 className="text-3xl md:text-5xl font-black text-red-600 mb-6 montserrat uppercase tracking-tighter leading-none">
                                                            {item.title}
                                                        </h3>
                                                        <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                                                        <p className="text-gray-500 text-lg md:text-2xl leading-relaxed montserrat font-medium italic">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                {/* Bottom Bracket SVG */}
                                                <div className="w-full max-w-xl h-24 -mt-1 relative z-30">
                                                    <svg width="100%" height="100%" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                                        <path d="M0 10C0 25 10 30 20 30H160C180 30 200 35 200 60V100" stroke="#dc2626" strokeWidth="2" />
                                                        <path d="M400 10C400 25 390 30 380 30H240C220 30 200 35 200 60V100" stroke="#dc2626" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ── CASE: WITH IMAGE (Alternating Layout) ── */
                                            <div className={`flex flex-col md:flex-row items-center w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                                
                                                {/* Text Content */}
                                                <motion.div 
                                                    initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                                    className="w-full md:w-1/2 pl-16 md:pl-0 md:px-16 lg:px-24 mb-10 md:mb-0"
                                                >
                                                    <div className={`flex flex-col ${index % 2 !== 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} text-left`}>
                                                        <h3 className="text-2xl md:text-3xl font-black text-red-600 mb-6 montserrat uppercase tracking-tighter leading-none">
                                                            {item.title}
                                                        </h3>
                                                        <div className={`w-12 h-1 bg-red-600 mb-6 ${index % 2 !== 0 ? '' : 'md:ml-auto'}`}></div>
                                                        <p className="text-gray-500 text-base md:text-lg leading-relaxed montserrat font-medium max-w-lg">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                {/* Image Container */}
                                                <motion.div 
                                                    initial={{ opacity: 0, x: index % 2 === 0 ? 60 : -60 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                                    className="w-full md:w-1/2 px-6 md:px-16 lg:px-24"
                                                >
                                                    <div className="relative group">
                                                        {/* Photo Shadow/Glow effect */}
                                                        <div className="absolute -inset-2 bg-red-600/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                                        
                                                        <div className="relative rounded-[2rem] overflow-hidden flex items-center justify-center max-h-[400px] md:max-h-[550px] w-full bg-white shadow-xl border border-gray-100">
                                                            <img 
                                                                src={`${import.meta.env.BASE_URL}images/history/${item.year}.webp`} 
                                                                alt={item.title}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    e.target.src = `https://placehold.co/800x600/f3f4f6/9ca3af?text=${item.year}`;
                                                                }}
                                                            />
                                                            {/* Year Overlay for mobile */}
                                                            <div className="absolute top-6 left-6 md:hidden">
                                                                <span className="bg-red-600 text-white px-3 py-1 rounded-full font-black text-[10px] montserrat">{item.year}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── FOOTER DECORATION ── */}
                <section className="py-32 flex flex-col items-center">
                    <div className="w-1 h-32 bg-red-600 mb-12"></div>
                    
                    <FooterLogoAnimation />
                </section>
            </div>
        </div>
    )
}

// Subcomponente para la animación del logo con efecto de revelado
const FooterLogoAnimation = () => {
    return (
        <div className="relative flex flex-col items-center justify-center h-56 w-full overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1] 
                }}
                className="flex flex-col items-center"
            >
                {/* Logo con brillo sutil */}
                <div className="relative group">
                    <img 
                        src={`${import.meta.env.BASE_URL}images/navbar/duyamis.webp`} 
                        alt="Duy Amis Logo" 
                        className="h-28 md:h-36 object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Brillo de fondo sutil */}
                    <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full scale-150 -z-10"></div>
                </div>

                <motion.p 
                    initial={{ opacity: 0, tracking: '0.2em' }}
                    whileInView={{ opacity: 1, tracking: '0.6em' }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                    className="text-gray-400 text-[10px] uppercase font-bold mt-10 text-center"
                >
                    Patrimonio Lácteo
                </motion.p>
            </motion.div>
        </div>
    )
}

export default History
