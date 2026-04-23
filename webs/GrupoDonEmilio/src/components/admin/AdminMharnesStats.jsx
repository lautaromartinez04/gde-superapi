import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAdminHeader } from './AdminLayout';
import { Zap, TreePine, Users, Droplets, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminMharnesStats() {
    const [stats, setStats] = useState({
        energy_generated: 0.0,
        trees_planted: 0,
        visitors: 0,
        stored_water: 0.0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { setHeaderState } = useAdminHeader();
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        setHeaderState({
            title: 'Mharnes',
            subtitle: 'Indicadores de Sostenibilidad'
        });
        fetchStats();
    }, [setHeaderState]);

    const fetchStats = async () => {
        try {
            const response = await api.get(`/mharnes/stats`);
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las estadísticas');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStats(prev => ({
            ...prev,
            [name]: name === 'trees_planted' || name === 'visitors' ? parseInt(value) || 0 : parseFloat(value) || 0.0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');
        
        try {
            await api.put(`/mharnes/stats`, stats);
            setSuccessMessage('Estadísticas actualizadas correctamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Error al actualizar las estadísticas');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-gray-400 font-tommy">Cargando indicadores...</div>;

    const statConfig = [
        {
            name: 'energy_generated',
            label: 'Energía Generada',
            unit: 'Kw',
            icon: Zap,
            bg: 'bg-[#293163]',
            step: "0.01"
        },
        {
            name: 'trees_planted',
            label: 'Árboles Plantados',
            unit: 'Unidades',
            icon: TreePine,
            bg: 'bg-[#1d71b7]',
            step: "1"
        },
        {
            name: 'visitors',
            label: 'Visitantes',
            unit: 'Personas',
            icon: Users,
            bg: 'bg-[#3BAE64]',
            step: "1"
        },
        {
            name: 'stored_water',
            label: 'Agua Almacenada',
            unit: 'M3',
            icon: Droplets,
            bg: 'bg-[#B0CE5E]',
            step: "0.01"
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto pb-12">
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-tommy flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-100 font-tommy flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statConfig.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div 
                                key={stat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${stat.bg} rounded-3xl p-6 shadow-lg border border-white/10 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-xl transition-all duration-300`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>
                                <label className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1 font-tommy">
                                    {stat.label}
                                </label>
                                <div className="text-[10px] text-white/70 mb-4 uppercase tracking-widest font-tommy">{stat.unit}</div>
                                
                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        step={stat.step}
                                        name={stat.name}
                                        value={stats[stat.name]}
                                        onChange={handleChange}
                                        className="w-full text-center text-3xl lg:text-4xl font-black text-white bg-transparent outline-none border-b-2 border-white/30 focus:border-white pb-2 transition-colors font-tommy [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-2xl transition-all shadow-[0px_10px_20px_rgba(227,37,21,0.2)] hover:shadow-[0px_15px_30px_rgba(227,37,21,0.3)] hover:-translate-y-1 flex items-center gap-3 font-tommy tracking-wider text-sm uppercase"
                    >
                        <Save size={20} />
                        {saving ? 'Guardando...' : 'Guardar Estadísticas'}
                    </button>
                </div>
            </form>
        </div>
    );
}
