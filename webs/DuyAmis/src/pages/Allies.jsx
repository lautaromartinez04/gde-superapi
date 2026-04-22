import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

export default function Allies() {
    const { t } = useTranslation()
    const [allies, setAllies] = useState([])
    const [loadedImages, setLoadedImages] = useState({})

    useEffect(() => {
        const fetchAllies = async () => {
            try {
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

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }))
    }

    return (
        <div className="flex flex-col min-h-[60vh] bg-gray-50 py-10">
            {/* ── ALLIES SECTION ── */}
            <section className="py-5 md:py-5 border-t border-gray-100 flex-1">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block montserrat">
                            {t('aliados.confian')}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-12 montserrat uppercase tracking-tighter leading-none">
                            {t('aliados.nuestros')} <span className="text-red-600">{t('aliados.aliados')}</span>
                        </h1>
                    </motion.div>

                    {allies.length === 0 && (
                        <p className="text-center w-full text-gray-500 font-medium pt-8">
                            {t('aliados.nohay')}
                        </p>
                    )}

                    <div className="flex flex-col items-center gap-12 w-full max-w-5xl mx-auto">
                        {allies.map((ally, idx) => {
                            const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:6500/api/duyamis'
                            const imageBaseURL = rawBaseURL.replace(/\/api\/duyamis\/?$/, '')
                            const CardTag = ally.website_url ? 'a' : 'div'
                            const cardProps = ally.website_url
                                ? { href: ally.website_url, target: '_blank', rel: 'noopener noreferrer' }
                                : {}
                            const isLoaded = loadedImages[ally.id]
                            return (
                                <motion.div
                                    key={ally.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="w-full flex justify-center py-2"
                                >
                                    <CardTag
                                        {...cardProps}
                                        className={`w-full block${ally.website_url ? ' cursor-pointer' : ''} relative`}
                                    >
                                        {/* Skeleton pulsante mientras carga */}
                                        {!isLoaded && (
                                            <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden">
                                                <div
                                                    className="w-full bg-gray-200 animate-pulse"
                                                    style={{ aspectRatio: '16/6' }}
                                                />
                                            </div>
                                        )}
                                        <img
                                            src={`${imageBaseURL}${ally.image_url}`}
                                            alt={ally.name}
                                            onLoad={() => handleImageLoad(ally.id)}
                                            className={`w-full h-auto object-contain rounded-2xl md:rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0px_20px_40px_rgba(227,37,21,0.2)] transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                                        />
                                    </CardTag>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
                <div className='w-full flex justify-center flex-col items-center gap-4'>
                    <p className='text-center w-full text-gray-500 font-semibold text-2xl pt-8 montserrat'>
                        {t('aliados.separte')}
                    </p>
                    <Link to='/contacto' className='bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-xl montserrat border-2 border-red-600 hover:bg-white hover:text-red-600 transition-all duration-300'>
                        {t('aliados.unete')}
                    </Link>
                </div>
            </section>
        </div>
    )
}
