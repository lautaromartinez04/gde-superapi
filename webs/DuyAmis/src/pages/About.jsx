import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const BRAND_RED = '#e32515'



export default function About() {
    const { t } = useTranslation()
    const steps = [
        {
            number: 1,
            numberIcon: 'fas fa-1',
            title: t('nosotros.sustentabilidad'),
            icon: 'fas fa-seedling',
            description: t('nosotros.crianza')
        },
        {
            number: 2,
            numberIcon: 'fas fa-2',
            title: t('nosotros.ordeñe'),
            icon: 'fas fa-robot',
            description: t('nosotros.tecnologia')
        },
        {
            number: 3,
            numberIcon: 'fas fa-3',
            title: t('nosotros.control'),
            icon: 'fas fa-vial',
            description: t('nosotros.analisis')
        },
        {
            number: 4,
            numberIcon: 'fas fa-4',
            title: t('nosotros.procesamiento'),
            icon: 'fas fa-industry',
            description: t('nosotros.elaboracion')
        },
        {
            number: 5,
            numberIcon: 'fas fa-5',
            title: t('nosotros.envasado'),
            icon: 'fas fa-box-open',
            description: t('nosotros.higiene')
        },
        {
            number: 6,
            numberIcon: 'fas fa-6',
            title: t('nosotros.distribucion'),
            icon: 'fas fa-truck',
            description: t('nosotros.desde')
        }
    ]
    const [allies, setAllies] = useState([])

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

    return (
        <div className="flex flex-col min-h-screen bg-white overflow-hidden">
            {/* ── HERO SECTION ── */}
            <section className="relative py-20 md:py-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block montserrat">{t('nosotros.identidad')}</span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 montserrat uppercase tracking-tighter leading-none">
                        {t('nosotros.compromiso')} <br className="hidden md:block" />
                        <span className="text-red-600">{t('nosotros.excelencia')}</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto montserrat font-medium">
                        {t('nosotros.resultado')}
                    </p>
                </motion.div>
            </section>

            {/* ── PROCESS SECTION (Del Tambo a la Góndola) ── */}
            <section className="bg-[#e32515] text-white py-16 md:py-24 px-6 relative shadow-[inset_0px_0px_30px_rgba(0,0,0,1)] overflow-hidden">
                {/* Cow Pattern Background (Staggered Brick Layout with Gap) */}
                <div className="absolute inset-0 opacity-[0.2] pointer-events-none select-none">
                    {Array.from({ length: 15 }).map((_, row) => (
                        <div
                            key={row}
                            className="flex"
                            style={{
                                marginLeft: row % 2 === 1 ? '-80px' : '-10px',
                                gap: '20px',
                                marginBottom: '20px'
                            }}
                        >
                            {Array.from({ length: 15 }).map((_, col) => (
                                <img
                                    key={col}
                                    src="images/about/vaca.webp"
                                    alt=""
                                    className="w-[140px] h-auto object-contain shrink-0"
                                    style={{ mixBlendMode: 'luminosity' }}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight montserrat mb-2 leading-none">{t('nosotros.tamboagondola')}</h2>
                        <p className="text-base md:text-lg opacity-80 montserrat font-medium uppercase tracking-[0.2em]">{t('nosotros.camino')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-12 md:gap-8 lg:gap-4">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                {/* Icon Container (Mechanical Cutout effect) */}
                                <div className="h-24 w-24 flex items-center justify-center mb-6">
                                    <i className={`${step.icon} text-5xl text-white`} style={{ textShadow: '-2px -2px 0px rgba(0,0,0,0.35)' }}></i>
                                </div>

                                {/* Title */}
                                <h3 className="text-[13px] md:text-[14px] font-black uppercase tracking-wider mb-6 montserrat leading-tight h-10 flex items-center justify-center text-center px-2">
                                    {step.title}
                                </h3>

                                {/* Number Circle (Sharp Mechanical Cutout) */}
                                <div className="w-8 h-8 rounded-full bg-white text-[#e32515] flex items-center justify-center relative shadow-[-2px_-2px_0px_rgba(0,0,0,0.35)]">
                                    <span className="text-xs font-black" style={{ transform: 'translateY(0.5px)' }}>
                                        {step.number}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs md:text-[13px] leading-relaxed montserrat font-medium max-w-[180px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HERITAGE SECTION ── */}
            <section className="py-24 md:py-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 montserrat uppercase tracking-tighter leading-tight">
                            {t('nosotros.nuestra')} <span className="text-red-600">{t('nosotros.herencia')}</span>
                        </h2>
                        <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed montserrat font-medium">
                            <p>
                                {t('nosotros.planta')}
                            </p>
                            <p>
                                {t('nosotros.creemos')}
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[380px] md:h-[380px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0px_0px_70px_rgba(227,37,21,0.35)] border border-red-50 flex flex-col items-center justify-center p-8 md:p-12 text-center border-2 border-red-500"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">

                            <div className="flex flex-col items-center mb-10 pt-4">
                                <p className="text-[10px] md:text-xs font-black wardrum tracking-[0.3em] text-gray-400 mb-2 uppercase">{t('nosotros.recetade')}</p>
                                <p className="text-5xl md:text-6xl italic font-black salty text-red-600 leading-tight">Néstor Giraudo</p>
                            </div>

                            <div className="w-16 h-0.5 bg-red-600/20 mb-10 rounded-full" />

                            <p className="font-['Salty'] text-3xl md:text-4xl text-gray-800">{t('nosotros.calidad')}</p>
                            <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-bold mt-4">{t('nosotros.tradicion')}</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
