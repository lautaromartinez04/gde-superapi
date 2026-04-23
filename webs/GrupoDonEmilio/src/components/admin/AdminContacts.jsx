import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosConfig';
import { adminSwal as Swal } from './swalConfig';
import { RefreshCcw, Mail, Phone, Calendar, Globe, Inbox, Trash2, StickyNote, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useAdminHeader } from './AdminLayout';

// ── Helpers ──────────────────────────────────────────────────────────────────
const BtnRefresh = ({ onClick }) => (
    <button onClick={onClick}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1d23] border border-white/10 rounded-xl text-slate-200 text-sm font-semibold cursor-pointer hover:bg-[#242931] hover:border-white/20 active:scale-[.97] transition-all">
        <RefreshCcw size={16} /><span className="hidden sm:inline">Actualizar</span>
    </button>
);

const Spinner = ({ text }) => (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-500">
        <div className="w-10 h-10 border-[3px] border-red-500/10 border-t-red-500 rounded-full animate-spin" />
        <span className="text-sm">{text}</span>
    </div>
);

const EmptyState = ({ icon, text }) => (
    <div className="py-24 flex flex-col items-center justify-center text-center text-slate-500 gap-6">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[1.25rem] text-slate-700">{icon}</div>
        <p className="m-0 font-semibold text-[0.9375rem] text-slate-400">{text}</p>
    </div>
);

const Th = ({ children, className = '' }) => (
    <th className={`px-5 py-4 bg-white/[0.02] text-[0.75rem] font-bold text-slate-500 uppercase tracking-[0.05em] border-b border-white/5 text-left whitespace-nowrap ${className}`}>
        {children}
    </th>
);

// origin color for left border
const originBorder = (service = '') => {
    const s = service.toLowerCase().replace(/\s+/g, '');
    if (s.includes('duyamis')) return 'border-l-4 border-l-red-500';
    if (s.includes('donemilio')) return 'border-l-4 border-l-blue-500';
    if (s.includes('mharnes')) return 'border-l-4 border-l-cyan-500';
    return '';
};

const StatusBadge = ({ resolved }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.7rem] font-bold uppercase w-fit
        ${resolved
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
        {resolved ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
        {resolved ? 'Resuelto' : 'Nuevo'}
    </span>
);

const ActionBtn = ({ onClick, title, variant = 'default', children }) => {
    const v = {
        default: 'text-slate-400 border-white/5 bg-white/[0.03] hover:-translate-y-0.5 hover:bg-white/[0.08]',
        resolve: 'text-emerald-400 border-emerald-500/20 bg-white/[0.03] hover:-translate-y-0.5',
        note: 'text-amber-400 border-amber-500/20 bg-white/[0.03] hover:-translate-y-0.5',
        delete: 'text-red-400 border-red-500/20 bg-white/[0.03] hover:bg-red-500 hover:text-white',
    };
    return (
        <button onClick={onClick} title={title}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-200 ${v[variant]}`}>
            {children}
        </button>
    );
};

// ── Component ─────────────────────────────────────────────────────────────────
const AdminContacts = () => {
    const { setHeaderState } = useAdminHeader();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const CONTACT_API = `/contact`;

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`${CONTACT_API}/`);
            setMessages(data || []);
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudieron cargar los mensajes', icon: 'error' });
        } finally { setLoading(false); }
    }, [CONTACT_API]);

    useEffect(() => {
        setHeaderState({ title: 'Bandeja de Contactos', actions: <BtnRefresh onClick={fetchMessages} /> });
        return () => setHeaderState({ title: 'Panel de Control', actions: null });
    }, [setHeaderState, fetchMessages]);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleToggleRead = async (id, current) => {
        try {
            await api.patch(`${CONTACT_API}/${id}`, { is_read: !current });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !current } : m));
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo actualizar el estado', icon: 'error' });
        }
    };

    const handleDelete = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿ELIMINAR CONTACTO?', text: 'Esta acción es irreversible.',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'SÍ, ELIMINAR', cancelButtonText: 'CANCELAR',
        });
        if (!isConfirmed) return;
        try {
            await api.delete(`${CONTACT_API}/${id}`);
            setMessages(prev => prev.filter(m => m.id !== id));
            Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo eliminar', icon: 'error' });
        }
    };

    const handleNote = async (id, currentNote) => {
        const { value: note } = await Swal.fire({
            title: 'Nota del Administrador',
            input: 'textarea',
            inputLabel: 'Añade una nota interna',
            inputValue: currentNote || '',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            inputPlaceholder: 'Escribe aquí...',
        });
        if (note === undefined) return;
        try {
            await api.patch(`${CONTACT_API}/${id}`, { notes: note });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, notes: note } : m));
            Swal.fire({ title: 'Guardado', icon: 'success', timer: 1200, showConfirmButton: false });
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo guardar la nota', icon: 'error' });
        }
    };

    if (loading) return <Spinner text="Cargando mensajes..." />;

    return (
        <div className="animate-[fadeIn_.4s_ease-out]">
            <div className="bg-[#1a1d23] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {messages.length === 0 ? (
                    <EmptyState icon={<Inbox size={48} />} text="No hay mensajes nuevos en la bandeja" />
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr>
                                        <Th>Fecha / Estado</Th>
                                        <Th>Enviado por</Th>
                                        <Th>Contacto</Th>
                                        <Th>Mensaje</Th>
                                        <Th className="text-center">Acciones</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg.id}
                                            className={`border-b border-white/[0.03] transition-colors
                                                ${!msg.is_read ? 'bg-blue-500/[0.03]' : ''}
                                                ${originBorder(msg.service)}
                                                hover:bg-white/[0.01]`}>
                                            {/* Date/Status */}
                                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-bold text-slate-200 text-sm">
                                                        {new Date(msg.created_at).toLocaleDateString()}
                                                    </span>
                                                    <StatusBadge resolved={msg.is_read} />
                                                </div>
                                            </td>
                                            {/* Sender */}
                                            <td className="px-5 py-4 align-middle">
                                                <p className={`font-semibold text-sm m-0 ${!msg.is_read ? 'text-white' : 'text-slate-100'}`}>
                                                    {msg.name} {msg.lastName}
                                                </p>
                                                <p className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-tighter m-0 mt-0.5 opacity-70">
                                                    {msg.service}
                                                </p>
                                            </td>
                                            {/* Contact info */}
                                            <td className="px-5 py-4 align-middle">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1.5 text-[0.8rem] text-slate-400">
                                                        <Mail size={12} />{msg.email}
                                                    </span>
                                                    {msg.phone && (
                                                        <span className="flex items-center gap-1.5 text-[0.8rem] text-slate-400">
                                                            <Phone size={12} />{msg.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            {/* Message */}
                                            <td className="px-5 py-4 align-middle max-w-[280px]">
                                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap m-0">{msg.message}</p>
                                                {msg.notes && (
                                                    <div className="flex items-start gap-1.5 mt-2 px-3 py-2 bg-amber-500/5 border-l-2 border-amber-400 rounded-r-lg text-xs text-amber-600 italic">
                                                        <StickyNote size={12} className="mt-0.5 shrink-0" />
                                                        <span>{msg.notes}</span>
                                                    </div>
                                                )}
                                            </td>
                                            {/* Actions */}
                                            <td className="px-5 py-4 align-middle">
                                                <div className="flex gap-2 justify-center items-center">
                                                    {!msg.is_read && (
                                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" title="Nuevo" />
                                                    )}
                                                    <ActionBtn onClick={() => handleToggleRead(msg.id, msg.is_read)}
                                                        title={msg.is_read ? 'Volver a Pendiente' : 'Marcar Resuelto'}
                                                        variant={msg.is_read ? 'default' : 'resolve'}>
                                                        {msg.is_read ? <CheckCircle size={16} /> : <Circle size={16} />}
                                                    </ActionBtn>
                                                    <ActionBtn onClick={() => handleNote(msg.id, msg.notes)} title="Nota" variant="note">
                                                        <StickyNote size={16} />
                                                    </ActionBtn>
                                                    <ActionBtn onClick={() => handleDelete(msg.id)} title="Eliminar" variant="delete">
                                                        <Trash2 size={16} />
                                                    </ActionBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile / tablet cards */}
                        <div className="lg:hidden flex flex-col gap-4 p-4">
                            {messages.map(msg => (
                                <div key={msg.id}
                                    className={`bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 ${originBorder(msg.service)} rounded-l-none`}>
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div>
                                            <p className="font-semibold text-slate-100 m-0 text-sm">{msg.name} {msg.lastName}</p>
                                            <p className="text-[0.7rem] text-slate-500 uppercase tracking-tight m-0">{msg.service}</p>
                                        </div>
                                        <StatusBadge resolved={msg.is_read} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5 text-xs text-slate-400"><Mail size={11} />{msg.email}</span>
                                        {msg.phone && <span className="flex items-center gap-1.5 text-xs text-slate-400"><Phone size={11} />{msg.phone}</span>}
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed m-0 whitespace-pre-wrap">{msg.message}</p>
                                    {msg.notes && (
                                        <div className="flex items-start gap-1.5 px-3 py-2 bg-amber-500/5 border-l-2 border-amber-400 rounded-r-lg text-xs text-amber-600 italic">
                                            <StickyNote size={11} className="mt-0.5 shrink-0" /><span>{msg.notes}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2 border-t border-white/5 items-center">
                                        {!msg.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                        <ActionBtn onClick={() => handleToggleRead(msg.id, msg.is_read)}
                                            title={msg.is_read ? 'Volver a pendiente' : 'Marcar resuelto'}
                                            variant={msg.is_read ? 'default' : 'resolve'}>
                                            {msg.is_read ? <CheckCircle size={16} /> : <Circle size={16} />}
                                        </ActionBtn>
                                        <ActionBtn onClick={() => handleNote(msg.id, msg.notes)} title="Nota" variant="note">
                                            <StickyNote size={16} />
                                        </ActionBtn>
                                        <ActionBtn onClick={() => handleDelete(msg.id)} title="Eliminar" variant="delete">
                                            <Trash2 size={16} />
                                        </ActionBtn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminContacts;
