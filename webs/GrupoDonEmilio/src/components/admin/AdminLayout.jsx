import React, { useState, createContext, useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    MessageSquare, Mail, Star, Grid, Box, Menu, X,
    ChevronDown, Globe, MapPin, Users, Activity, Clock, KeyRound, Check, Copy, LogOut
} from 'lucide-react';
import { logout } from '../../api/auth';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';

const AdminHeaderContext = createContext();

export const useAdminHeader = () => {
    const context = useContext(AdminHeaderContext);
    if (!context) throw new Error('useAdminHeader must be used within AdminHeaderProvider');
    return context;
};

const navItem = (isActive) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9375rem] font-medium font-tommy transition-all duration-200 cursor-pointer no-underline
    ${isActive
        ? 'bg-red-500 text-white shadow-[0_10px_15px_-3px_rgba(239,68,68,0.25)]'
        : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'}`;

const CollapsibleGroup = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 rounded-lg transition-all group cursor-pointer outline-none active:scale-[0.98]"
            >
                <span className="text-[0.65rem] font-extrabold text-red-500 uppercase tracking-[0.3em] opacity-70 group-hover:text-slate-400 group-hover:opacity-100 transition-all select-none font-tommy">
                    {title}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-500 group-hover:text-slate-300"
                >
                    <ChevronDown size={14} />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 mt-1 px-2 pb-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TokenPanel = () => {
    const stored = () => localStorage.getItem('authToken') || '';
    const [token, setToken] = useState(stored);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSave = () => {
        localStorage.setItem('authToken', token.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCopy = () => {
        if (!token) return;
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setToken('');
        localStorage.removeItem('authToken');
    };

    return (
        <div className="px-2 pt-1 pb-3 flex flex-col gap-2">
            <textarea
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Pegá el JWT aquí..."
                rows={4}
                className="w-full bg-[#0f1115] border border-white/10 rounded-lg px-3 py-2
                    text-[0.72rem] text-slate-300 font-mono placeholder-slate-600
                    resize-none outline-none focus:border-red-500/50 transition-colors
                    leading-relaxed"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                        text-[0.75rem] font-bold font-tommy uppercase tracking-wider
                        transition-all duration-200 cursor-pointer
                        ${saved
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'}`}
                >
                    {saved ? <><Check size={13} /> Guardado</> : <><KeyRound size={13} /> Guardar</>}
                </button>
                <button
                    onClick={handleCopy}
                    title="Copiar token"
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer
                        ${ copied
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200'}`}
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                    onClick={handleClear}
                    title="Limpiar"
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5
                        text-slate-500 hover:text-red-400 hover:border-red-500/30
                        transition-all duration-200 cursor-pointer text-[0.7rem] font-tommy font-bold uppercase"
                >
                    <X size={14} />
                </button>
            </div>
            {token && (
                <p className="text-[0.65rem] text-slate-600 font-mono text-center truncate px-1">
                    {token.length} caracteres
                </p>
            )}
        </div>
    );
};

const AdminLayout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [headerState, setHeaderState] = useState({ title: 'Panel de Control', actions: null });

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <AdminHeaderContext.Provider value={{ setHeaderState }}>
            <div className="flex min-h-screen bg-[#0f1115] text-slate-200">

                {/* Mobile overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={closeSidebar}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 h-screen z-50
                    w-[280px] lg:w-[280px] flex flex-col
                    bg-[#1a1d23] border-r border-white/5
                    transition-transform duration-[400ms] cubic-bezier-[0.165,0.84,0.44,1]
                    lg:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full'}
                `}>
                    {/* Sidebar header */}
                    <div className="px-6 pt-4 pb-2">
                        <div className="flex justify-between items-center mb-4 lg:mb-0 min-h-[40px]">
                            <button
                                className="lg:hidden text-slate-400 p-1 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                                onClick={closeSidebar}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase italic m-0 font-tommy">
                            Web's Admin
                        </h2>
                        <p className="text-[0.75rem] text-slate-500 mt-1 mb-0 uppercase tracking-[0.2em] font-bold font-tommy">
                            Grupo Don Emilio
                        </p>
                    </div>

                    {/* Separator */}
                    <div className="mx-6 my-3 h-px bg-gradient-to-r from-white/5 to-transparent" />

                    {/* Nav */}
                    <nav className="flex-1 px-3 py-2 flex flex-col gap-0 overflow-y-auto
                        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full">

                        <CollapsibleGroup title="GRUPO DON EMILIO">
                            <NavLink to="/admin/contacts" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <Mail size={20} /><span>Contactos</span>
                            </NavLink>
                            <NavLink to="/admin/grupo/allies" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <Users size={20} /><span>Aliados Corporativos</span>
                            </NavLink>
                        </CollapsibleGroup>

                        <CollapsibleGroup title="DON EMILIO">
                            <NavLink to="/admin/donemilio/schedules" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <Clock size={20} /><span>Sucursales y Horarios</span>
                            </NavLink>
                        </CollapsibleGroup>

                        <CollapsibleGroup title="DUY AMIS">
                            <NavLink to="/admin/duyamis/categories" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <Grid size={20} /><span>Categorías</span>
                            </NavLink>
                            <NavLink to="/admin/duyamis/products" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <Box size={20} /><span>Productos</span>
                            </NavLink>
                            <NavLink to="/admin/duyamis/sellpoints" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <MapPin size={20} /><span>Puntos de Venta</span>
                            </NavLink>
                        </CollapsibleGroup>

                        <CollapsibleGroup title="MHARNES">
                            <NavLink to="/admin/mharnes/stats" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <Activity size={20} /><span>Estadísticas</span>
                            </NavLink>
                            <NavLink to="/admin/comments" onClick={closeSidebar} className={({ isActive }) => navItem(isActive)}>
                                <MessageSquare size={20} /><span>Comentarios</span>
                            </NavLink>
                        </CollapsibleGroup>

                        <CollapsibleGroup title="TOKEN">
                            <TokenPanel />
                        </CollapsibleGroup>

                        <CollapsibleGroup title="PÁGINAS WEB">
                            {[
                                { href: '/', label: 'Grupo Don Emilio' },
                                { href: '/donemilio/', label: 'Don Emilio' },
                                { href: '/duyamis/', label: 'Duy Amis' },
                                { href: '/mharnes/', label: 'Mharnes' },
                            ].map(({ href, label }) => (
                                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9375rem] font-medium font-tommy text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all duration-200 no-underline">
                                    <Globe size={20} /><span>{label}</span>
                                </a>
                            ))}
                        </CollapsibleGroup>
                    </nav>

                    {/* Footer with User Info and Logout */}
                    <div className="p-4 border-t border-white/5 bg-[#1a1d23] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                                <Users size={20} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[0.85rem] font-bold text-white truncate font-tommy uppercase tracking-wide">
                                    {user?.nombre_completo || user?.usuario || 'Admin'}
                                </span>
                                <span className="text-[0.65rem] text-slate-500 font-medium truncate uppercase tracking-[0.2em] font-tommy">
                                    {user?.rol || 'Administrador'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            title="Cerrar Sesión"
                            className="p-3 bg-white/5 hover:bg-red-500 text-slate-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer shadow-sm active:scale-90 shrink-0"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 flex flex-col overflow-x-hidden min-w-0">
                    {/* Topbar */}
                    <header className="h-16 flex items-center px-4 lg:px-8 bg-[#1a1d23] border-b border-white/5 justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden text-white p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                                onClick={toggleSidebar}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex flex-col">
                                <h1 className="text-base lg:text-lg font-semibold text-slate-400 m-0 font-tommy tracking-wider leading-tight">
                                    {headerState.title}
                                </h1>
                                {headerState.subtitle && (
                                    <span className="text-[10px] text-slate-500 font-tommy uppercase tracking-widest mt-0.5">
                                        {headerState.subtitle}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={headerState.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-3"
                                >
                                    {headerState.actions}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </AdminHeaderContext.Provider>
    );
};

export default AdminLayout;
