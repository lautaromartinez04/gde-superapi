import React, { useState, useEffect } from 'react';
import { useAdminHeader } from './AdminLayout';
import { motion } from 'framer-motion';
import {
    Plus,
    MapPin,
    Trash2,
    Edit2,
    ExternalLink,
    Search,
    Navigation,
    ChevronRight,
    Building2,
    Save,
    X
} from 'lucide-react';
import axios from 'axios';
import { adminSwal as Swal } from './swalConfig';

const API_BASE = 'http://localhost:6500/api';

const AdminSellpoints = () => {
    const { setHeaderState } = useAdminHeader();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isEditingSeller, setIsEditingSeller] = useState(false);
    const [currentSeller, setCurrentSeller] = useState(null);
    const [showCityModal, setShowCityModal] = useState(false);
    const [newCityName, setNewCityName] = useState('');

    useEffect(() => {
        setHeaderState({
            title: 'Puntos de Venta',
            subtitle: 'Gestión de Ciudades y Vendedores',
            actions: (
                <button
                    onClick={() => setShowCityModal(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all font-tommy text-sm"
                >
                    <Plus size={18} />
                    <span>Nueva Ciudad</span>
                </button>
            )
        });
        const fetchDataInternal = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/sellpoints/cities`);
                setCities(res.data);
                if (res.data.length > 0) {
                    setSelectedCity(res.data[0]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchDataInternal();
    }, [setHeaderState]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/sellpoints/cities`);
            setCities(res.data);
            if (res.data.length > 0 && !selectedCity) {
                setSelectedCity(res.data[0]);
            } else if (selectedCity) {
                // Refresh selected city data
                const updated = res.data.find(c => c.id === selectedCity.id);
                if (updated) setSelectedCity(updated);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCity = async () => {
        if (!newCityName.trim()) return;
        try {
            await axios.post(`${API_BASE}/sellpoints/cities`, { name: newCityName });
            setNewCityName('');
            setShowCityModal(false);
            fetchData();
            Swal.fire('Éxito', 'Ciudad creada correctamente', 'success');
        } catch (error) {
            console.error('Error creating city:', error);
            Swal.fire('Error', 'No se pudo crear la ciudad', 'error');
        }
    };

    const handleDeleteCity = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminarán todos los vendedores asociados a esta ciudad.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE}/sellpoints/cities/${id}`);
                if (selectedCity?.id === id) setSelectedCity(null);
                fetchData();
                Swal.fire('Eliminado', 'La ciudad ha sido eliminada.', 'success');
            } catch (error) {
                console.error('Error deleting city:', error);
                Swal.fire('Error', 'No se pudo eliminar la ciudad', 'error');
            }
        }
    };

    const handleSaveSeller = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const sellerData = {
            name: formData.get('name'),
            address: formData.get('address'),
            maps_url: formData.get('maps_url'),
            lat: formData.get('lat') ? parseFloat(formData.get('lat')) : null,
            lng: formData.get('lng') ? parseFloat(formData.get('lng')) : null,
            city_id: selectedCity.id
        };

        try {
            if (currentSeller) {
                await axios.put(`${API_BASE}/sellpoints/sellers/${currentSeller.id}`, sellerData);
            } else {
                await axios.post(`${API_BASE}/sellpoints/sellers`, sellerData);
            }
            setIsEditingSeller(false);
            setCurrentSeller(null);
            fetchData();
            Swal.fire('Éxito', 'Vendedor guardado correctamente', 'success');
        } catch (error) {
            console.error('Error saving seller:', error);
            Swal.fire('Error', 'No se pudo guardar el vendedor', 'error');
        }
    };

    const handleDeleteSeller = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar vendedor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE}/sellpoints/sellers/${id}`);
                fetchData();
                Swal.fire('Eliminado', 'Vendedor eliminado.', 'success');
            } catch (error) {
                console.error('Error deleting seller:', error);
                Swal.fire('Error', 'No se pudo eliminar el vendedor', 'error');
            }
        }
    };

    if (loading && cities.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mr-3"></div>
                <span>Cargando datos...</span>
            </div>
        );
    }

    return (
        <div className="admin-sellpoints-container space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Cities Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-tommy uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Building2 size={16} />
                                Ciudades
                            </h3>
                            <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded-full font-bold">
                                {cities.length}
                            </span>
                        </div>
                        <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {cities.map(city => (
                                <div
                                    key={city.id}
                                    onClick={() => setSelectedCity(city)}
                                    className={`flex items-center justify-between group p-3 rounded-xl cursor-pointer transition-all ${selectedCity?.id === city.id
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                            : 'hover:bg-white/5 text-slate-400'
                                        }`}
                                >
                                    <span className="font-tommy font-medium">{city.name}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCity(city.id); }}
                                            className="p-1.5 hover:bg-black/20 rounded-lg text-white/50 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sellers List */}
                <div className="lg:col-span-8">
                    {selectedCity ? (
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
                                <div className="relative z-10 flex-1 min-w-0">
                                    <h2 className="text-2xl md:text-3xl font-tommy italic text-white flex flex-wrap items-center gap-4">
                                        <span className="truncate">{selectedCity.name}</span>
                                        <span className="text-[10px] uppercase tracking-tighter not-italic bg-white/10 text-slate-400 px-3 py-1 rounded-lg font-bold border border-white/5">
                                            {selectedCity.sellers?.length || 0} Vendedores
                                        </span>
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1 font-medium">Gestionando los puntos de venta en esta ubicación.</p>
                                </div>
                                <button
                                    onClick={() => { setCurrentSeller(null); setIsEditingSeller(true); }}
                                    className="relative z-10 flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-tommy font-bold hover:scale-105 transition-all shadow-2xl shrink-0 group/btn"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center group-hover/btn:bg-red-600 group-hover/btn:text-white transition-colors">
                                        <Plus size={20} />
                                    </div>
                                    <span>Agregar Vendedor</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {selectedCity.sellers?.map(seller => (
                                    <div key={seller.id} className="bg-slate-900/30 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                                                    <MapPin size={24} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xl font-tommy text-white truncate">{seller.name}</h4>
                                                    <p className="text-slate-500 text-sm flex items-center gap-2 mt-0.5">
                                                        {seller.address || 'Sin dirección'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => { setCurrentSeller(seller); setIsEditingSeller(true); }}
                                                    className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSeller(seller.id)}
                                                    className="p-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-white/5"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                                            <div className="flex-1 grid grid-cols-2 gap-3 w-full sm:w-auto">
                                                <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col">
                                                    <span className="text-[10px] uppercase text-slate-600 font-bold mb-0.5 tracking-widest">Latitud</span>
                                                    <span className="text-sm text-slate-300 font-mono italic truncate">{seller.lat || '--'}</span>
                                                </div>
                                                <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col">
                                                    <span className="text-[10px] uppercase text-slate-600 font-bold mb-0.5 tracking-widest">Longitud</span>
                                                    <span className="text-sm text-slate-300 font-mono italic truncate">{seller.lng || '--'}</span>
                                                </div>
                                            </div>

                                            {seller.maps_url && (
                                                <a
                                                    href={seller.maps_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center justify-center gap-3 px-6 py-3.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-xs font-bold transition-all uppercase tracking-[0.2em] shrink-0 border border-blue-600/20"
                                                >
                                                    <span>Google Maps</span>
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!selectedCity.sellers || selectedCity.sellers.length === 0) && (
                                    <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-white/5">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-4">
                                            <Search size={32} />
                                        </div>
                                        <p className="text-slate-400 font-tommy italic">No hay vendedores registrados en esta ciudad.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center py-40 bg-slate-900/20 rounded-3xl border-2 border-dashed border-white/5">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center text-red-600 mx-auto animate-pulse">
                                    <Navigation size={40} />
                                </div>
                                <h3 className="text-xl font-tommy italic text-slate-400">Seleccioná una ciudad para gestionar sus puntos de venta.</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* City Modal */}
            {showCityModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 w-full max-w-md p-8 rounded-[2rem] shadow-2xl"
                    >
                        <h3 className="text-xl font-tommy italic text-white mb-6">Nueva Ciudad</h3>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-tommy"
                            placeholder="Nombre de la ciudad (Ej: Villa María)"
                            value={newCityName}
                            onChange={(e) => setNewCityName(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowCityModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl font-tommy text-slate-400 hover:bg-white/5 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateCity}
                                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-tommy font-bold hover:scale-105 transition-all shadow-lg"
                            >
                                Guardar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Seller Form Modal */}
            {isEditingSeller && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-white/10 w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-tommy italic text-white">
                                {currentSeller ? 'Editar Vendedor' : 'Nuevo Vendedor'}
                            </h3>
                            <button onClick={() => setIsEditingSeller(false)} className="text-slate-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSeller} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-full">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Nombre Comercial</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-tommy"
                                        defaultValue={currentSeller?.name}
                                    />
                                </div>
                                <div className="space-y-2 col-span-full">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Dirección Física</label>
                                    <input
                                        name="address"
                                        type="text"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-tommy"
                                        defaultValue={currentSeller?.address}
                                    />
                                </div>
                                <div className="space-y-2 col-span-full">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">URL Google Maps</label>
                                    <input
                                        name="maps_url"
                                        type="url"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-tommy text-xs italic"
                                        defaultValue={currentSeller?.maps_url}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Latitud</label>
                                    <input
                                        name="lat"
                                        type="number"
                                        step="any"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-mono italic"
                                        defaultValue={currentSeller?.lat}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Longitud</label>
                                    <input
                                        name="lng"
                                        type="number"
                                        step="any"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all font-mono italic"
                                        defaultValue={currentSeller?.lng}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingSeller(false)}
                                    className="flex-1 py-4 px-6 rounded-2xl font-tommy text-slate-400 hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 px-6 bg-red-600 text-white rounded-2xl font-tommy font-bold hover:scale-[1.02] transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    <span>{currentSeller ? 'Actualizar' : 'Guardar'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminSellpoints;
