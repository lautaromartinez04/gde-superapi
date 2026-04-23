import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAdminHeader } from './AdminLayout';
import { adminSwal as Swal } from './swalConfig';
import { AnimatePresence, motion } from 'framer-motion';
import {
    MapPin, Clock, Plus, Trash2, Save, Edit2, X, Check, Link, Navigation
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const emptySchedule = { days: '', hours: '' };
const emptyBranch = {
    name: '', address: '', maps_url: '', maps_embed_url: '', lat: '', lng: '', order: 0
};

export default function AdminDonEmilioSchedules() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [editingBranch, setEditingBranch] = useState(null); // {id, ...fields}
    const [newBranch, setNewBranch] = useState(null); // null or draft object
    const [scheduleEdits, setScheduleEdits] = useState({}); // {scheduleId: {days, hours}}
    const [newSchedules, setNewSchedules] = useState({}); // {branchId: [{days, hours}]}

    const { setHeaderState } = useAdminHeader();

    useEffect(() => {
        setHeaderState({ title: 'Don Emilio', subtitle: 'Sucursales y Horarios' });
        fetchBranches();
    }, [setHeaderState]);

    const fetchBranches = async () => {
        try {
            const res = await api.get(`/donemilio/branches`);
            setBranches(Array.isArray(res.data) ? res.data : []);
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudieron cargar las sucursales', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // --- BRANCH CRUD ---
    const saveBranch = async () => {
        try {
            if (editingBranch) {
                const { id, ...data } = editingBranch;
                await api.put(`/donemilio/branches/${id}`, data);
            } else if (newBranch) {
                await api.post(`/donemilio/branches`, newBranch);
                setNewBranch(null);
            }
            await fetchBranches();
            setEditingBranch(null);
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo guardar la sucursal', icon: 'error' });
        }
    };

    const deleteBranch = async (id, name) => {
        const result = await Swal.fire({
            title: '¿Eliminar sucursal?',
            html: `Se eliminará <strong>${name}</strong> y todos sus horarios.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        await api.delete(`/donemilio/branches/${id}`);
        await fetchBranches();
        if (expandedId === id) setExpandedId(null);
    };

    // --- SCHEDULE CRUD ---
    const saveScheduleEdit = async (scheduleId) => {
        const data = scheduleEdits[scheduleId];
        if (!data) return;
        await api.put(`/donemilio/schedules/${scheduleId}`, data);
        setScheduleEdits(prev => { const n = { ...prev }; delete n[scheduleId]; return n; });
        await fetchBranches();
    };

    const deleteSchedule = async (scheduleId) => {
        const result = await Swal.fire({
            title: '¿Eliminar horario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        await api.delete(`/donemilio/schedules/${scheduleId}`);
        await fetchBranches();
    };

    const addNewSchedules = async (branchId) => {
        const rows = newSchedules[branchId] || [];
        for (const row of rows) {
            if (row.days && row.hours) {
                await api.post(`/donemilio/branches/${branchId}/schedules`, row);
            }
        }
        setNewSchedules(prev => { const n = { ...prev }; delete n[branchId]; return n; });
        await fetchBranches();
    };

    if (loading) return <div className="text-center p-8 text-gray-400 font-tommy">Cargando sucursales...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto pb-12 space-y-6">
            {/* Add Branch Button */}
            {!newBranch && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setNewBranch({ ...emptyBranch })}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(239,68,68,0.2)] hover:-translate-y-1 font-tommy"
                    >
                        <Plus size={18} /> Agregar Sucursal
                    </button>
                </div>
            )}

            {/* New Branch Form */}
            <AnimatePresence>
                {newBranch && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#15181d] rounded-3xl p-8 border border-red-500/30 shadow-xl"
                    >
                        <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-6 font-tommy">Nueva Sucursal</h3>
                        <BranchForm data={newBranch} onChange={setNewBranch} />
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setNewBranch(null)} className="px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white font-tommy">Cancelar</button>
                            <button onClick={saveBranch} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all font-tommy">
                                <Save size={16} /> Guardar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Branch List */}
            {branches.length === 0 && !newBranch && (
                <div className="text-center py-16 text-slate-600 font-tommy">
                    <MapPin size={32} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm uppercase tracking-widest">No hay sucursales. ¡Agregá la primera!</p>
                </div>
            )}

            {branches.map((branch, i) => {
                const isExpanded = expandedId === branch.id;
                const isEditing = editingBranch?.id === branch.id;

                return (
                    <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-[#15181d] rounded-3xl border border-white/5 overflow-hidden shadow-lg"
                    >
                        {/* Branch Header */}
                        <div className="flex items-center justify-between p-6 gap-4">
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : branch.id)}
                                className="flex items-center gap-4 flex-1 text-left group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-red-600/10 text-red-400 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase tracking-widest text-sm font-tommy">{branch.name}</p>
                                    {branch.address && <p className="text-slate-500 text-xs font-tommy mt-0.5">{branch.address}</p>}
                                </div>
                                <Clock
                                    size={18}
                                    className={`ml-auto transition-all duration-200 group-hover:scale-110 cursor-pointer ${isExpanded
                                            ? 'text-red-400 scale-110'
                                            : 'text-slate-600 group-hover:text-red-300'
                                        }`}
                                />
                            </button>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setEditingBranch(isEditing ? null : { ...branch })}
                                    className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                    title="Editar"
                                >
                                    {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                                </button>
                                <button
                                    onClick={() => deleteBranch(branch.id, branch.name)}
                                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Edit Branch Form inline */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-6 border-t border-white/5 pt-6"
                                >
                                    <BranchForm data={editingBranch} onChange={setEditingBranch} />
                                    <div className="flex gap-3 justify-end mt-4">
                                        <button onClick={() => setEditingBranch(null)} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white font-tommy">Cancelar</button>
                                        <button onClick={saveBranch} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all font-tommy">
                                            <Save size={14} /> Guardar
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Schedules collapse */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5"
                                >
                                    <div className="p-6 space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-tommy mb-4 flex items-center gap-2">
                                            <Clock size={14} /> Horarios
                                        </p>

                                        {branch.schedules.map(sched => {
                                            const editing = scheduleEdits[sched.id];
                                            return (
                                                <div key={sched.id} className="flex items-center gap-3 group">
                                                    {editing ? (
                                                        <>
                                                            <input
                                                                value={editing.days}
                                                                onChange={e => setScheduleEdits(prev => ({ ...prev, [sched.id]: { ...prev[sched.id], days: e.target.value } }))}
                                                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 font-tommy"
                                                                placeholder="Días (ej: Lunes a Viernes)"
                                                            />
                                                            <input
                                                                value={editing.hours}
                                                                onChange={e => setScheduleEdits(prev => ({ ...prev, [sched.id]: { ...prev[sched.id], hours: e.target.value } }))}
                                                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 font-tommy"
                                                                placeholder="Horario (ej: 8:00 a 18:00hs)"
                                                            />
                                                            <button onClick={() => saveScheduleEdit(sched.id)} className="p-2 text-emerald-400 hover:text-emerald-300 cursor-pointer"><Check size={16} /></button>
                                                            <button onClick={() => setScheduleEdits(prev => { const n = { ...prev }; delete n[sched.id]; return n; })} className="p-2 text-slate-500 hover:text-white cursor-pointer"><X size={16} /></button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex-1 text-sm text-slate-300 font-tommy">{sched.days}</div>
                                                            <div className="flex-1 text-sm text-white font-black font-tommy">{sched.hours}</div>
                                                            <button
                                                                onClick={() => setScheduleEdits(prev => ({ ...prev, [sched.id]: { days: sched.days, hours: sched.hours } }))}
                                                                className="p-1.5 text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                            ><Edit2 size={14} /></button>
                                                            <button
                                                                onClick={() => deleteSchedule(sched.id)}
                                                                className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                            ><Trash2 size={14} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* New schedule rows */}
                                        {(newSchedules[branch.id] || []).map((row, ri) => (
                                            <div key={ri} className="flex items-center gap-3">
                                                <input
                                                    value={row.days}
                                                    onChange={e => setNewSchedules(prev => {
                                                        const arr = [...(prev[branch.id] || [])];
                                                        arr[ri] = { ...arr[ri], days: e.target.value };
                                                        return { ...prev, [branch.id]: arr };
                                                    })}
                                                    className="flex-1 bg-black/40 border border-red-500/30 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500 font-tommy"
                                                    placeholder="Días (ej: Lunes a Viernes)"
                                                />
                                                <input
                                                    value={row.hours}
                                                    onChange={e => setNewSchedules(prev => {
                                                        const arr = [...(prev[branch.id] || [])];
                                                        arr[ri] = { ...arr[ri], hours: e.target.value };
                                                        return { ...prev, [branch.id]: arr };
                                                    })}
                                                    className="flex-1 bg-black/40 border border-red-500/30 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500 font-tommy"
                                                    placeholder="Horario (ej: 8:00 a 18:00hs)"
                                                />
                                                <button onClick={() => setNewSchedules(prev => {
                                                    const arr = (prev[branch.id] || []).filter((_, idx) => idx !== ri);
                                                    return { ...prev, [branch.id]: arr };
                                                })} className="p-1.5 text-slate-500 hover:text-red-400"><X size={14} /></button>
                                            </div>
                                        ))}

                                        <div className="flex items-center gap-3 pt-2">
                                            <button
                                                onClick={() => setNewSchedules(prev => ({ ...prev, [branch.id]: [...(prev[branch.id] || []), { ...emptySchedule }] }))}
                                                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors font-tommy"
                                            >
                                                <Plus size={14} /> Agregar fila
                                            </button>
                                            {(newSchedules[branch.id] || []).length > 0 && (
                                                <button
                                                    onClick={() => addNewSchedules(branch.id)}
                                                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all font-tommy"
                                                >
                                                    <Save size={14} /> Guardar horarios
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

function BranchForm({ data, onChange }) {
    const set = (key, val) => onChange(prev => ({ ...prev, [key]: val }));
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy">Nombre de la Sucursal *</label>
                <input
                    value={data.name || ''}
                    onChange={e => set('name', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-lg font-black uppercase tracking-wider outline-none focus:border-red-500/50 transition-colors font-tommy"
                    placeholder="Ej: Av. Perón 1650"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy flex items-center gap-1"><MapPin size={10} /> Dirección</label>
                <input
                    value={data.address || ''}
                    onChange={e => set('address', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 text-white outline-none focus:border-red-500/50 transition-colors font-tommy"
                    placeholder="Ej: Av. Perón 1650, Villa María"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy flex items-center gap-1"><Link size={10} /> URL Google Maps (link externo)</label>
                <input
                    value={data.maps_url || ''}
                    onChange={e => set('maps_url', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 text-white outline-none focus:border-red-500/50 transition-colors font-tommy text-xs"
                    placeholder="https://maps.google.com/..."
                />
            </div>
            <div className="col-span-full space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy flex items-center gap-1"><Navigation size={10} /> URL Mapa Embebido (embed src)</label>
                <input
                    value={data.maps_embed_url || ''}
                    onChange={e => set('maps_embed_url', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 text-white outline-none focus:border-red-500/50 transition-colors font-tommy text-xs"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy">Latitud</label>
                <input
                    type="number"
                    step="0.0001"
                    value={data.lat || ''}
                    onChange={e => set('lat', parseFloat(e.target.value) || null)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 text-white outline-none focus:border-red-500/50 transition-colors font-tommy [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="-32.4203314"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy">Longitud</label>
                <input
                    type="number"
                    step="0.0001"
                    value={data.lng || ''}
                    onChange={e => set('lng', parseFloat(e.target.value) || null)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 text-white outline-none focus:border-red-500/50 transition-colors font-tommy [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="-63.2216466"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-tommy">Orden de Visualización</label>
                <input
                    type="number"
                    step="1"
                    value={data.order ?? 0}
                    onChange={e => set('order', parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 text-white outline-none focus:border-red-500/50 transition-colors font-tommy [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
        </div>
    );
}
