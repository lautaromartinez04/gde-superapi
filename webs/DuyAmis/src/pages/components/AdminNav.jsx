import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminNav = ({ title, subtitle, showAdd = true, addLabel = '', onAdd = null }) => {
    const navigate = useNavigate();

    return (
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 p-4 md:p-8 relative">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/5 blur-[120px] -z-10 pointer-events-none" />

            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                            Admin<span className="text-red-600 decoration-8 underline-offset-4">Duy Amis</span>
                        </h1>
                    </div>
                </div>

                <div className="pt-2 px-1">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{title}</h2>
                    <p className="text-slate-500 text-xs font-medium max-w-sm mt-1">{subtitle}</p>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                <div className="flex items-center bg-slate-900/40 backdrop-blur-2xl p-1.5 rounded-full border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full sm:w-auto">
                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `flex-1 sm:flex-none flex items-center justify-center px-8 h-10 rounded-full text-[11px] font-black transition-all duration-500 tracking-widest cursor-pointer whitespace-nowrap ${isActive ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40 translate-y-[1px]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                        }
                    >
                        CATEGORÍAS
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `flex-1 sm:flex-none flex items-center justify-center px-8 h-10 rounded-full text-[11px] font-black transition-all duration-500 tracking-widest cursor-pointer whitespace-nowrap ${isActive ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40 translate-y-[1px]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                        }
                    >
                        PRODUCTOS
                    </NavLink>
                </div>

                {showAdd && (
                    <button
                        onClick={onAdd}
                        className="group relative overflow-hidden bg-white text-black px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_15px_30px_rgba(255,255,255,0.1)] w-full sm:w-auto cursor-pointer whitespace-nowrap"
                    >
                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-0" />
                        <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-plus text-sm"></i> {addLabel}
                        </span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default AdminNav;
