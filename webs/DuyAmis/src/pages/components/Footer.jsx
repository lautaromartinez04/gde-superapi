import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '/images/navbar/duyamis.webp'

const BRAND_RED = '#e32515'

export default function Footer() {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)

    const links = [
        { labelKey: 'navbar.inicio', to: '/' },
        { labelKey: 'navbar.nosotros', to: '/nosotros' },
        { labelKey: 'navbar.historia', to: '/historia' },
        { labelKey: 'navbar.productos', to: '/productos' },
        { labelKey: 'navbar.contacto', to: '/contacto' },
        { labelKey: 'navbar.comprar', to: '/comprar' },
        { labelKey: 'navbar.trabajaConNosotros', to: 'https://grupodonemilio.com/unite/', external: true },
    ]

    const copyMail = () => {
        navigator.clipboard.writeText('vgiraudo@donemiliosrl.com.ar')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <footer className="bg-white border-t border-red-50 pt-16 pb-8 px-6 overflow-hidden relative border-t-2 border-red-500">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Column 1: Brand & Logo */}
                    <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
                        <Link to="/" className="block group">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={logo}
                                alt="Duy Amis"
                                className="h-16 w-auto drop-shadow-sm transition-all"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs montserrat">
                            {t('footer.descripcion')}
                            <span className="block mt-2 italic font-semibold text-gray-400 salty text-xl">
                                {t('footer.slogan')}
                            </span>
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 montserrat">
                            {t('footer.navegacion')}
                        </h4>
                        <ul className="space-y-4 flex flex-col items-center">
                            {links.map((link) => (
                                <li key={link.labelKey}>
                                    {link.external ? (
                                        <a
                                            href={link.to}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-gray-600 hover:text-red-600 transition-colors duration-300 text-sm font-medium uppercase tracking-wider block group relative w-fit mx-auto"
                                        >
                                            <span className="relative z-10">{t(link.labelKey)}</span>
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full rounded-full" />
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.to}
                                            className="text-gray-600 hover:text-red-600 transition-colors duration-300 text-sm font-medium uppercase tracking-wider block group relative w-fit mx-auto"
                                        >
                                            <span className="relative z-10">{t(link.labelKey)}</span>
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full rounded-full" />
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact & Social */}
                    <div className="flex flex-col items-center md:items-end space-y-6 text-center md:text-right">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 montserrat">
                            {t('footer.contacto')}
                        </h4>
                        <div className="space-y-4 flex flex-col items-center md:items-end">
                            <p className="text-gray-500 text-sm montserrat">
                                <span className="block font-bold text-gray-700 uppercase tracking-tighter text-xs mb-1">{t('footer.fabrica')}</span>
                                Ramón J. Cárcano 125, Ana Zumarán, Córdoba
                            </p>
                            <p className="text-gray-500 text-sm montserrat">
                                <span className="block font-bold text-gray-700 uppercase tracking-tighter text-xs mb-1">{t('footer.adminVentas')}</span>
                                Pablo Colabianchi 412, Villa María, Córdoba
                            </p>

                            <div className="pt-4 flex gap-4 justify-center md:justify-end">
                                <motion.a
                                    whileHover={{ scale: 1.1, backgroundColor: BRAND_RED, color: '#fff' }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    href="https://www.instagram.com/duyamislacteos"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shadow-sm"
                                >
                                    <i className="fab fa-instagram text-lg"></i>
                                </motion.a>
                                <NavLink to="/contacto">
                                    <motion.a
                                        whileHover={{ scale: 1.1, backgroundColor: BRAND_RED, color: '#fff' }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shadow-sm pr-1"
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </motion.a>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest montserrat text-center md:text-left">
                        © {new Date().getFullYear()} {t('footer.copyright')}
                    </p>
                    <div className="flex items-center gap-2 opacity-10 grayscale select-none pointer-events-none">
                        <span className="text-[10px] font-black wardrum uppercase">{t('footer.premiumQuality')}</span>
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <span className="text-[10px] font-black wardrum uppercase">{t('footer.tradicion')}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
