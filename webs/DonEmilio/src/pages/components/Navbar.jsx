import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../media/images/navbar/donemilio1.webp';

const Navbar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Main Navbar (Static/Normal Flow) */}
            <nav className="bg-[#0033a1] shadow-md w-full relative z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex flex-col items-start md:items-center justify-between h-auto py-4 md:pt-4 md:pb-1">
                        {/* Logo Section */}
                        <div className="flex items-center justify-center">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="Don Emilio Logo"
                                    className="h-16 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu + Lang Toggle */}
                        <div className="hidden md:block">
                            <div className="flex space-x-8 items-center">
                                <Link
                                    to="/"
                                    className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300"
                                >
                                    {t('navbar.inicio')}
                                    <span
                                        className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                    ></span>
                                </Link>
                                <Link
                                    to="/nosotros"
                                    className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300"
                                >
                                    {t('navbar.sobreNosotros')}
                                    <span
                                        className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/nosotros') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                    ></span>
                                </Link>
                                <Link
                                    to="/empresas"
                                    className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300"
                                >
                                    {t('navbar.paraEmpresas')}
                                    <span
                                        className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/empresas') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                    ></span>
                                </Link>
                                <Link
                                    to="/aliados"
                                    className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300"
                                >
                                    {t('navbar.aliados')}
                                    <span
                                        className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/aliados') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                    ></span>
                                </Link>
                                <Link
                                    to="/contacto"
                                    className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300"
                                >
                                    {t('navbar.contacto')}
                                    <span
                                        className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/contacto') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                    ></span>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2">
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="bg-[#0033a1] inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    id="mobile-menu"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center bg-[#0033a1]">
                        <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-white font-bold bg-white/10' : 'text-white hover:text-gray-200'}`} onClick={() => setIsOpen(false)}>
                            {t('navbar.inicio')}
                        </Link>
                        <Link to="/nosotros" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/nosotros') ? 'text-white font-bold bg-white/10' : 'text-white hover:text-gray-200'}`} onClick={() => setIsOpen(false)}>
                            {t('navbar.sobreNosotros')}
                        </Link>
                        <Link to="/empresas" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/empresas') ? 'text-white font-bold bg-white/10' : 'text-white hover:text-gray-200'}`} onClick={() => setIsOpen(false)}>
                            {t('navbar.paraEmpresas')}
                        </Link>
                        <Link to="/aliados" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/aliados') ? 'text-white font-bold bg-white/10' : 'text-white hover:text-gray-200'}`} onClick={() => setIsOpen(false)}>
                            {t('navbar.aliados')}
                        </Link>
                        <Link to="/contacto" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contacto') ? 'text-white font-bold bg-white/10' : 'text-white hover:text-gray-200'}`} onClick={() => setIsOpen(false)}>
                            {t('navbar.contacto')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Sticky/Fixed Navbar (Links Only - Appears on Scroll) */}
            <div
                className={`fixed top-0 left-0 w-full bg-[#0033a1]/95 backdrop-blur-sm shadow-md z-50 transition-transform duration-300 ease-in-out ${isScrolled ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-12">
                        <div className="flex space-x-8 items-center">
                            <Link to="/" className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300">
                                {t('navbar.inicio')}
                                <span className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                            <Link to="/nosotros" className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300">
                                {t('navbar.sobreNosotros')}
                                <span className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/nosotros') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                            <Link to="/empresas" className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300">
                                {t('navbar.paraEmpresas')}
                                <span className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/empresas') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                            <Link to="/aliados" className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300">
                                {t('navbar.aliados')}
                                <span className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/aliados') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                            <Link to="/contacto" className="group relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300">
                                {t('navbar.contacto')}
                                <span className={`absolute bottom-1 left-0 w-full h-0.5 bg-white transform origin-center transition-transform duration-300 ease-out ${isActive('/contacto') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
