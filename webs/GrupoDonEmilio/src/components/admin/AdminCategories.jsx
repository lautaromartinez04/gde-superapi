import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllData, deleteCategory } from '../../api/duyamis_api';
import { adminSwal as Swal } from './swalConfig';
import { Pencil, Trash2, Plus, LayoutGrid } from 'lucide-react';
import { useAdminHeader } from './AdminLayout';

// ── Helpers ──────────────────────────────────────────────────────────────────
const BtnAdd = ({ onClick, label }) => (
    <button onClick={onClick}
        className="flex items-center gap-2 bg-white text-black border-0 px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-2xl font-black text-xs tracking-widest cursor-pointer transition-all duration-400 shadow-[0_10px_20px_rgba(255,255,255,0.05)] hover:bg-red-500 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(239,68,68,0.3)] uppercase font-tommy whitespace-nowrap">
        <Plus size={16} /><span className="hidden sm:inline">{label}</span><span className="sm:hidden">NUEVA</span>
    </button>
);

const BtnIcon = ({ onClick, title, variant, children }) => {
    const v = {
        edit: 'bg-slate-400/5 text-slate-400 hover:bg-white hover:text-black hover:scale-115',
        delete: 'bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white hover:scale-115',
    };
    return (
        <button onClick={onClick} title={title}
            className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-white/5 cursor-pointer transition-all duration-300 ${v[variant]}`}>
            {children}
        </button>
    );
};

const Spinner = ({ text }) => (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-500">
        <div className="w-10 h-10 border-[3px] border-red-500/10 border-t-red-500 rounded-full animate-spin" />
        <span className="text-sm">{text}</span>
    </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const AdminCategories = () => {
    const { setHeaderState } = useAdminHeader();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const fetched = await fetchAllData();
            setCategories(fetched.Categories || []);
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Error al cargar las categorías: ' + error.message, icon: 'error' });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setHeaderState({
            title: 'Categorías DuyAmis',
            actions: <BtnAdd onClick={() => navigate('/admin/duyamis/categories/new')} label="NUEVA CATEGORÍA" />
        });
        return () => setHeaderState({ title: 'Panel de Control', actions: null });
    }, [setHeaderState, navigate]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleDelete = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿ELIMINAR CATEGORÍA?',
            text: 'Se eliminarán también todos los productos asociados. ¡Piénsalo bien!',
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'SÍ, ELIMINAR TODO', cancelButtonText: 'CANCELAR',
        });
        if (!isConfirmed) return;
        try {
            await deleteCategory(id);
            loadData();
            Swal.fire({ title: 'Eliminado', icon: 'success', timer: 2000, showConfirmButton: false });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    if (loading) return <Spinner text="Sincronizando categorías..." />;

    return (
        <div className="animate-[fadeIn_.4s_ease-out]">
            {categories.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center text-slate-500 gap-6">
                    <LayoutGrid size={64} className="opacity-20" />
                    <p className="font-semibold text-slate-400">No hay categorías creadas aún</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 py-4">
                    {categories.map(cat => (
                        <div key={cat.id}
                            className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-5 flex flex-col items-center transition-all duration-400 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                            {/* Image */}
                            <div className="w-full aspect-square flex items-center justify-center p-6 mb-5 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_75%)] relative overflow-hidden">
                                <img
                                    src={`${cat.logo}?t=${new Date().getTime()}`}
                                    alt={cat.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-600 group-hover:scale-110 group-hover:rotate-2"
                                />
                            </div>
                            {/* Footer */}
                            <div className="w-full flex flex-col gap-2 px-1 pb-1">
                                <div>
                                    <h4 className="font-black text-lg text-white uppercase italic tracking-tight leading-none">{cat.name}</h4>
                                    <span className="text-[0.6rem] font-extrabold text-gray-600 uppercase tracking-[0.2em]">
                                        {cat.products?.length || 0} Productos
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <BtnIcon onClick={() => navigate(`/admin/duyamis/categories/edit/${cat.id}`)} title="Editar" variant="edit">
                                        <Pencil size={15} />
                                    </BtnIcon>
                                    <BtnIcon onClick={() => handleDelete(cat.id)} title="Eliminar" variant="delete">
                                        <Trash2 size={15} />
                                    </BtnIcon>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
