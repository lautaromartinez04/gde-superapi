import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: '#b51c11',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[90] w-12 h-12 md:w-14 md:h-14 bg-[#e32515] text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none group"
                    aria-label="Volver arriba"
                >
                    <i className="fas fa-arrow-up text-lg md:text-xl"></i>
                </motion.button>
            )}
        </AnimatePresence>
    )
}
