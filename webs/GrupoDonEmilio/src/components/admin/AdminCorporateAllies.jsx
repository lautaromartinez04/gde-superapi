import React, { useState, useEffect } from 'react';
import { useAdminHeader } from './AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Image as ImageIcon, Save, X, Search, CheckSquare, Square, Globe } from 'lucide-react';

import api from '../../api/axiosConfig';
import { adminSwal as Swal } from './swalConfig';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const AVAILABLE_BRANDS = [
    { id: 'donemilio', label: 'Don Emilio' },
    { id: 'duyamis', label: 'Duy Amis' },
    { id: 'mharnes', label: 'Mharnes' },
    { id: 'grupo', label: 'Grupo Don Emilio' }
];

const AdminCorporateAllies = () => {
    const { setHeaderState } = useAdminHeader();
    const [allies, setAllies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAlly, setCurrentAlly] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        setHeaderState({
            title: 'Aliados Corporativos',
            actions: (
                <button
                    onClick={() => {
                        setCurrentAlly(null);
                        setSelectedBrands([]);
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all font-tommy text-sm whitespace-nowrap cursor-pointer"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Nuevo Aliado</span>
                    <span className="sm:hidden">Nuevo</span>
                </button>
            )
        });
        fetchData();
    }, [setHeaderState]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/allies`);
            setAllies(res.data);
        } catch (error) {
            console.error('Error fetching allies:', error);
            Swal.fire('Error', 'No se pudieron cargar los aliados', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (selectedBrands.length === 0) {
            Swal.fire('Atención', 'Debés seleccionar al menos una marca para mostrar el aliado.', 'warning');
            return;
        }

        const formData = new FormData(e.target);
        formData.append('brands', selectedBrands.join(','));

        if (!currentAlly && !formData.get('image').name) {
            Swal.fire('Atención', 'Debés adjuntar una imagen para el nuevo aliado.', 'warning');
            return;
        }

        try {
            // Remove empty image file before sending if not updated
            if (formData.get('image') && !formData.get('image').name) {
                formData.delete('image');
            }

                await api.put(`/allies/${currentAlly.id}`, formData);
            } else {
                await api.post(`/allies`, formData);
            }
            setIsEditing(false);
            setCurrentAlly(null);
            fetchData();
            Swal.fire('Éxito', 'Aliado guardado correctamente', 'success');
        } catch (error) {
            console.error('Error saving ally:', error);
            Swal.fire('Error', 'No se pudo guardar el aliado', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar aliado?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/allies/${id}`);
                fetchData();
                Swal.fire('Eliminado', 'Aliado eliminado.', 'success');
            } catch (error) {
                console.error('Error deleting ally:', error);
                Swal.fire('Error', 'No se pudo eliminar el aliado', 'error');
            }
        }
    };

    const toggleBrand = (brandId) => {
        if (selectedBrands.includes(brandId)) {
            setSelectedBrands(selectedBrands.filter(id => id !== brandId));
        } else {
            setSelectedBrands([...selectedBrands, brandId]);
        }
    };

    if (loading && allies.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mr-3"></div>
                <span>Cargando aliados...</span>
            </div>
        );
    }

    return (
        <div className="admin-corp-allies-container space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allies.map(ally => {
                    const brandsList = ally.brands.split(',').filter(Boolean);
                    return (
                        <div key={ally.id} className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                            <div className="aspect-video bg-black/40 p-0 flex items-center justify-center relative overflow-hidden">
                                {ally.image_url ? (
                                    <>
                                        {/* Skeleton pulsante */}
                                        {!loadedImages[ally.id] && (
                                            <div className="absolute inset-0 bg-slate-700/60 animate-pulse" />
                                        )}
                                        <img
                                            src={`http://localhost:6500${ally.image_url}`}
                                            alt={ally.name}
                                            onLoad={() => handleImageLoad(ally.id)}
                                            className={`max-w-full max-h-full object-contain drop-shadow-md p-4 transition-opacity duration-700 ${loadedImages[ally.id] ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </>
                                ) : (
                                    <ImageIcon size={48} className="text-slate-700" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setCurrentAlly(ally);
                                            setSelectedBrands(ally.brands.split(',').filter(Boolean));
                                            setIsEditing(true);
                                        }}
                                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ally.id)}
                                        className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-tommy text-white mb-1">{ally.name}</h3>
                                {ally.website_url && (
                                    <a href={ally.website_url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mb-2 truncate transition-colors"
                                    >
                                        <Globe size={10} /> {ally.website_url}
                                    </a>
                                )}
                                <div className="mt-auto flex flex-wrap gap-2">
                                    {brandsList.map(bid => {
                                        const bDef = AVAILABLE_BRANDS.find(b => b.id === bid);
                                        return (
                                            <span key={bid} className="text-[10px] bg-white/10 text-slate-300 px-2 py-1 rounded border border-white/5 uppercase tracking-wider font-bold">
                                                {bDef ? bDef.label : bid}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {allies.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-4">
                            <Search size={32} />
                        </div>
                        <p className="text-slate-400 font-tommy italic">No hay aliados publicitarios registrados.</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 w-full max-w-lg p-8 rounded-[2rem] shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-tommy italic text-white flex items-center gap-3">
                                {currentAlly ? <Edit2 size={24} className="text-red-500" /> : <Plus size={24} className="text-green-500" />}
                                {currentAlly ? 'Editar Aliado' : 'Nuevo Aliado'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Nombre o Empresa</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-tommy"
                                    defaultValue={currentAlly?.name}
                                    placeholder="Ej: La Serenísima"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Globe size={12} /> Página web (opcional)</label>
                                <input
                                    name="website_url"
                                    type="url"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-tommy text-sm"
                                    defaultValue={currentAlly?.website_url || ''}
                                    placeholder="https://www.ejemplo.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Asignar marcas (A dónde pertenece)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {AVAILABLE_BRANDS.map(brand => {
                                        const isChecked = selectedBrands.includes(brand.id);
                                        return (
                                            <div
                                                key={brand.id}
                                                onClick={() => toggleBrand(brand.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked
                                                        ? 'bg-red-600/10 border-red-500/50 text-white'
                                                        : 'bg-black/20 border-white/5 text-slate-400 hover:bg-black/40 hover:border-white/10'
                                                    }`}
                                            >
                                                {isChecked ? <CheckSquare size={18} className="text-red-500" /> : <Square size={18} />}
                                                <span className="font-tommy text-sm">{brand.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">
                                    Imagen / Banner
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all font-tommy"
                                    />
                                    {currentAlly?.image_url && (
                                        <p className="text-[10px] text-slate-500 mt-2 ml-2 italic">
                                            Actualmente tiene un banner cargado. Sube uno nuevo solo si querés reemplazarlo.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-tommy font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3 px-4 bg-red-600 text-white rounded-xl font-tommy font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    <span>Guardar</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminCorporateAllies;
