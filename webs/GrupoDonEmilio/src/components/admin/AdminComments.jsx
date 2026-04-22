import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { adminSwal as Swal } from './swalConfig';
import { RefreshCcw, CheckCircle, XCircle, Trash2, User, Star, MessageSquare } from 'lucide-react';
import { useAdminHeader } from './AdminLayout';

// ── Shared Tailwind helpers ──────────────────────────────────────────────────
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

// Shared table/card styles for responsive stacking
const Th = ({ children, className = '' }) => (
    <th className={`px-6 py-4 bg-white/[0.02] text-[0.75rem] font-bold text-slate-500 uppercase tracking-[0.05em] border-b border-white/5 text-left ${className}`}>
        {children}
    </th>
);

const StatusBadge = ({ verified }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.7rem] font-bold uppercase w-fit
        ${verified
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
        {verified ? 'Visible' : 'Pendiente'}
    </span>
);

const ActionBtn = ({ onClick, title, variant = 'default', children }) => {
    const variants = {
        default: 'text-slate-400 border-white/5 bg-white/[0.03] hover:-translate-y-0.5 hover:bg-white/[0.08]',
        approve: 'text-emerald-400 border-emerald-500/20 bg-white/[0.03] hover:-translate-y-0.5 hover:bg-white/[0.08]',
        hide: 'text-slate-400 border-white/5 bg-white/[0.03] hover:-translate-y-0.5 hover:bg-white/[0.08]',
        delete: 'text-red-400 border-red-500/20 bg-white/[0.03] hover:bg-red-500 hover:text-white',
    };
    return (
        <button onClick={onClick} title={title}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-200 ${variants[variant]}`}>
            {children}
        </button>
    );
};

// ── Component ─────────────────────────────────────────────────────────────────
const AdminComments = () => {
    const { setHeaderState } = useAdminHeader();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_API_BASE || '/api';

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE}/mharnes/comments/admin`);
            setComments(data || []);
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudieron cargar los comentarios', icon: 'error' });
        } finally { setLoading(false); }
    }, [API_BASE]);

    useEffect(() => {
        setHeaderState({ title: 'Moderación de Comentarios', actions: <BtnRefresh onClick={fetchComments} /> });
        return () => setHeaderState({ title: 'Panel de Control', actions: null });
    }, [setHeaderState, fetchComments]);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    const handleVerify = async (id, current) => {
        try {
            const fd = new FormData();
            fd.append('is_verified', (!current).toString());
            await axios.put(`${API_BASE}/mharnes/comments/${id}/verify`, fd);
            setComments(prev => prev.map(c => c.id === id ? { ...c, is_verified: !current } : c));
            Swal.fire({ title: !current ? '¡Verificado!' : 'Desverificado', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    const handleDelete = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿ELIMINAR COMENTARIO?', text: 'Esta acción es irreversible.',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'SÍ, ELIMINAR', cancelButtonText: 'CANCELAR',
        });
        if (!isConfirmed) return;
        try {
            await axios.delete(`${API_BASE}/mharnes/comments/${id}`);
            setComments(prev => prev.filter(c => c.id !== id));
            Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'No se pudo eliminar el comentario', 'error');
        }
    };

    const handleDeletePhoto = async (photoId) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿ELIMINAR FOTO?', text: '¿Estás seguro?',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'SÍ, BORRAR', cancelButtonText: 'CANCELAR',
        });
        if (!isConfirmed) return;
        try {
            await axios.delete(`${API_BASE}/mharnes/comments/photos/${photoId}`);
            setComments(prev => prev.map(c => ({ ...c, photos: c.photos?.filter(p => p.id !== photoId) ?? [] })));
            Swal.fire({ title: 'Foto eliminada', icon: 'success', timer: 1000, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'No se pudo eliminar la foto', 'error');
        }
    };

    if (loading) return <Spinner text="Cargando comentarios..." />;

    return (
        <div className="animate-[fadeIn_.4s_ease-out]">
            <div className="bg-[#1a1d23] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {comments.length === 0 ? (
                    <EmptyState icon={<MessageSquare size={48} />} text="No hay comentarios para mostrar" />
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr>
                                        <Th>Autor / Institución</Th>
                                        <Th>Contenido</Th>
                                        <Th className="w-24">Estado</Th>
                                        <Th className="w-24 text-center">Acciones</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map(comment => (
                                        <tr key={comment.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                                            {/* Author */}
                                            <td className="px-6 py-5 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#2d333b] flex items-center justify-center text-slate-400 shrink-0">
                                                        <User size={16} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-100">{comment.author_name}</span>
                                                        {comment.institution && <span className="text-xs text-slate-500">{comment.institution}</span>}
                                                        <div className="flex gap-0.5 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={11}
                                                                    fill={i < comment.rating ? '#fbbf24' : 'transparent'}
                                                                    color={i < comment.rating ? '#fbbf24' : 'rgba(255,255,255,0.15)'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Content */}
                                            <td className="px-6 py-5 align-middle max-w-[320px]">
                                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap m-0">{comment.content}</p>
                                                {comment.photos?.length > 0 && (
                                                    <div className="flex flex-wrap gap-3 mt-3">
                                                        {comment.photos.map(photo => (
                                                            <div key={photo.id} className="relative w-14 h-14 group">
                                                                <img src={photo.thumb_url || photo.photo_url} alt="Adjunto"
                                                                    onClick={() => window.open(photo.photo_url, '_blank')}
                                                                    className="w-full h-full object-cover rounded-lg border border-white/10 cursor-pointer hover:scale-105 transition-transform" />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                                                                    title="Eliminar foto"
                                                                    className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer border-0"
                                                                >
                                                                    <Trash2 size={9} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            {/* Status */}
                                            <td className="px-6 py-5 align-middle"><StatusBadge verified={comment.is_verified} /></td>
                                            {/* Actions */}
                                            <td className="px-6 py-5 align-middle">
                                                <div className="flex gap-2 justify-center">
                                                    <ActionBtn
                                                        onClick={() => handleVerify(comment.id, comment.is_verified)}
                                                        title={comment.is_verified ? 'Ocultar' : 'Aprobar'}
                                                        variant={comment.is_verified ? 'hide' : 'approve'}
                                                    >
                                                        {comment.is_verified ? <XCircle size={17} /> : <CheckCircle size={17} />}
                                                    </ActionBtn>
                                                    <ActionBtn onClick={() => handleDelete(comment.id)} title="Eliminar" variant="delete">
                                                        <Trash2 size={17} />
                                                    </ActionBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden flex flex-col gap-4 p-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[#2d333b] flex items-center justify-center text-slate-400 shrink-0">
                                                <User size={15} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-100 m-0 text-sm">{comment.author_name}</p>
                                                {comment.institution && <p className="text-xs text-slate-500 m-0">{comment.institution}</p>}
                                            </div>
                                        </div>
                                        <StatusBadge verified={comment.is_verified} />
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11}
                                                fill={i < comment.rating ? '#fbbf24' : 'transparent'}
                                                color={i < comment.rating ? '#fbbf24' : 'rgba(255,255,255,0.15)'} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed m-0 whitespace-pre-wrap">{comment.content}</p>
                                    {comment.photos?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {comment.photos.map(photo => (
                                                <div key={photo.id} className="relative w-12 h-12 group">
                                                    <img src={photo.thumb_url || photo.photo_url} alt=""
                                                        onClick={() => window.open(photo.photo_url, '_blank')}
                                                        className="w-full h-full object-cover rounded-lg border border-white/10 cursor-pointer" />
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                                                        className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0">
                                                        <Trash2 size={8} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-1 border-t border-white/5">
                                        <ActionBtn onClick={() => handleVerify(comment.id, comment.is_verified)}
                                            title={comment.is_verified ? 'Ocultar' : 'Aprobar'}
                                            variant={comment.is_verified ? 'hide' : 'approve'}>
                                            {comment.is_verified ? <XCircle size={17} /> : <CheckCircle size={17} />}
                                        </ActionBtn>
                                        <ActionBtn onClick={() => handleDelete(comment.id)} title="Eliminar" variant="delete">
                                            <Trash2 size={17} />
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

export default AdminComments;
