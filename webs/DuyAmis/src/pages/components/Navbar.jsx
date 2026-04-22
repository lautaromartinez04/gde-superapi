import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
const logo = `${import.meta.env.BASE_URL}images/navbar/duyamis.webp`

const BRAND_RED = '#e32515'
const BRAND_CREAM = '#fffaf8'

function NavLink({ labelKey, to, onClick, className = '' }) {
    const { pathname } = useLocation()
    const { t } = useTranslation()
    const isActive = pathname === to

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative group px-1 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 montserrat ${className}`}
            style={{ color: isActive ? BRAND_RED : '#4a4a4a' }}
        >
            <span className="relative z-10">{t(labelKey)}</span>
            <motion.span
                className="absolute bottom-0 left-0 h-[2px] bg-red-600 rounded-full"
                initial={false}
                animate={{
                    width: isActive ? '100%' : '0%',
                    left: isActive ? '0%' : '50%',
                    opacity: isActive ? 1 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            {!isActive && (
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-red-600/40 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
            )}
        </Link>
    )
}

export default function Navbar() {
    const { t } = useTranslation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const { pathname } = useLocation()

    const linksLeft = [
        { labelKey: 'navbar.inicio', to: '/' },
        { labelKey: 'navbar.productos', to: '/productos' },
        { labelKey: 'navbar.nosotros', to: '/nosotros' },
        { labelKey: 'navbar.historia', to: '/historia' },
    ]

    const linksRight = [
        { labelKey: 'navbar.aliados', to: '/aliados' },
        { labelKey: 'navbar.comprar', to: '/comprar' },
        { labelKey: 'navbar.contacto', to: '/contacto' },
    ]

    const allLinks = [...linksLeft, ...linksRight]

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        const handleScroll = () => {
            if (menuOpen) return
            const currentScrollY = window.scrollY

            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.body.style.overflow = 'unset'
        }
    }, [lastScrollY, menuOpen])

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed top-0 left-0 w-full z-[100] py-4 shadow-sm border-b border-red-50 transition-colors duration-300 ${menuOpen ? 'bg-white' : 'bg-white/80 backdrop-blur-md'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16 relative">

                    {/* Desktop Left Links */}
                    <div className="hidden md:flex items-center gap-8 flex-1 justify-end pr-16">
                        {linksLeft.map((link) => (
                            <NavLink key={link.labelKey} {...link} />
                        ))}
                    </div>

                    {/* Logo */}
                    <motion.div
                        className="relative z-[102] pointer-events-auto"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/" className="block">
                            <img
                                src={logo}
                                alt="Duy Amis Logo"
                                className="h-14 md:h-16 w-auto drop-shadow-sm transition-all duration-300 hover:drop-shadow-md"
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Right Links */}
                    <div className="hidden md:flex items-center gap-8 flex-1 pl-16">
                        {linksRight.map((link) => (
                            <NavLink key={link.labelKey} {...link} />
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => {
                                setMenuOpen(!menuOpen)
                                if (!menuOpen) setIsVisible(true)
                            }}
                            className="relative z-[110] p-2 text-red-600 focus:outline-none"
                            aria-label="Menu"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <motion.span
                                    animate={menuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full"
                                />
                                <motion.span
                                    animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full"
                                />
                                <motion.span
                                    animate={menuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-current rounded-full"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[101] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[103] shadow-2xl md:hidden overflow-hidden flex flex-col pt-24 px-8"
                        >
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-50 to-transparent opacity-50" />

                            <div className="relative z-10 space-y-6">
                                {allLinks.map((link, i) => (
                                    <motion.div
                                        key={link.labelKey}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            to={link.to}
                                            onClick={() => setMenuOpen(false)}
                                            className={`block text-xl font-semibold montserrat tracking-wide ${
                                                pathname === link.to ? 'text-red-600' : 'text-gray-700'
                                            }`}
                                        >
                                            {t(link.labelKey)}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="pt-10 border-t border-gray-100">
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 montserrat">{t('navbar.siguenos')}</p>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                            <i className="fab fa-instagram"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pb-12 opacity-30 select-none">
                                <img src={logo} alt="" className="w-32 grayscale" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}