import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAllData, createCategory, updateCategory } from '../../api/duyamis_api';
import { AnimatePresence, motion } from 'framer-motion';
import { adminSwal as Swal } from './swalConfig';
import { useAdminHeader } from './AdminLayout';

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderState } = useAdminHeader();
    const isUpdate = !!id;

    const [formData, setFormData] = useState({
        color_fondo_vaquitas: '#f3f4f6FF',
        color_vaquitas: '#000000FF',
        color_letras_logo: '#ff0000FF',
        color_firma: '#000000FF',
        color_detalles: '#ff0000FF',
        color_fondo_letras: '#ffffffff',
        color_queso: '#ffcc00ff',
        color_texto1: '#000000FF',
        color_nombreypeso: '#000000FF',
        color_donemilio: '#ff0000FF',
        color_fondologo: '#ffffffff',
        color_fondocantprod: '#ff0000FF',
        color_cantprod: '#ffffffff',
        sombras: 'drop-shadow-2xl'
    });
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(isUpdate);

    useEffect(() => {
        if (isUpdate) {
            const loadCategory = async () => {
                try {
                    const data = await fetchAllData();
                    const category = data.Categories.find(c => c.id === parseInt(id));
                    if (category) {
                        setFormData(category);
                    } else {
                        Swal.fire('Error', 'Categoría no encontrada', 'error');
                        navigate('/admin/duyamis/categories');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Error al cargar categoría: ' + error.message, 'error');
                }
                setLoading(false);
            };
            loadCategory();
        }
    }, [id, isUpdate, navigate]);

    const getHexColor = (color) => {
        if (!color) return '#000000';
        return color.slice(0, 7);
    };

    const getAlphaValue = (color) => {
        if (!color || color.length < 9) return 100;
        const alphaHex = color.slice(7, 9);
        return Math.round((parseInt(alphaHex, 16) / 255) * 100);
    };

    const handleColorChange = (name, hex, alphaPercent) => {
        const alphaHex = Math.round((alphaPercent / 100) * 255).toString(16).padStart(2, '0').toUpperCase();
        const fullColor = `${hex.toUpperCase()}${alphaHex}`;
        setFormData(prev => ({ ...prev, [name]: fullColor }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    };

    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault();
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined &&
                !['products', 'colors', 'informacion nutricional'].includes(key)) {
                submissionData.append(key, formData[key]);
            }
        });

        Object.keys(files).forEach(key => {
            if (files[key]) submissionData.append(key, files[key]);
        });

        try {
            if (isUpdate) await updateCategory(id, submissionData);
            else await createCategory(submissionData);

            Swal.fire({
                title: '¡Guardado!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1a1d23',
                color: '#fff'
            });
            navigate('/admin/duyamis/categories');
        } catch (error) {
            Swal.fire('Error', 'Error al guardar categoría: ' + error.message, 'error');
        }
    }, [formData, files, id, isUpdate, navigate]);

    useEffect(() => {
        setHeaderState({
            title: isUpdate ? 'Editando Categoría' : 'Nueva Categoría',
            subtitle: formData.name || 'Nuevo Registro',
            actions: (
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/admin/duyamis/categories')} 
                        className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={() => handleSubmit()} 
                        className="bg-accent-red hover:bg-red-600 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition-all active:scale-95 border-none cursor-pointer text-white"
                    >
                        GUARDAR CAMBIOS
                    </button>
                </div>
            )
        });
        return () => setHeaderState({ title: 'Panel de Control', actions: null, subtitle: null });
    }, [setHeaderState, formData.name, isUpdate, navigate, handleSubmit]);

    if (loading) return (
        <div className="admin-loading">
            <div className="spinner"></div>
            <span>Cargando editor...</span>
        </div>
    );
    return (
        <div className="min-h-full bg-[#0f1115] text-white font-tommy">

            <main className="max-w-6xl mx-auto space-y-12 pb-20">
                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Información General */}
                    <section className="bg-[#15181d] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent-red/20" />

                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-red">Información General</h4>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            {/* Columna Izquierda: Logo */}
                            <div className="w-full lg:w-72 space-y-8 flex flex-col items-center">
                                <div className="relative group w-full aspect-square max-w-[280px] bg-black rounded-[2.5rem] border border-white/10 overflow-hidden flex items-center justify-center p-8 shadow-inner">
                                    {formData.logo && formData.logo !== 'null' ? (
                                        <img
                                            src={files.logo_file ? URL.createObjectURL(files.logo_file) : `${formData.logo}?t=${new Date().getTime()}`}
                                            alt="Preview"
                                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="text-slate-700 font-black italic text-xs uppercase tracking-tighter text-center">Sin Logo / Icono</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button type="button" onClick={() => document.getElementById('logo_input').click()} className="w-32 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors">CAMBIAR</button>
                                        <button type="button" onClick={() => { setFormData(prev => ({ ...prev, logo: 'null' })); setFiles(prev => ({ ...prev, logo_file: null })); }} className="w-32 py-2.5 bg-accent-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors">ELIMINAR</button>
                                    </div>
                                    <input id="logo_input" type="file" name="logo_file" onChange={handleFileChange} className="hidden" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center px-4 leading-relaxed">Este logo se aplicará como marca de agua en todos los productos de esta categoría.</p>
                            </div>

                            {/* Columna Derecha: Inputs */}
                            <div className="flex-1 space-y-10 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nombre Público de la Categoría</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-3xl font-black italic uppercase tracking-tighter outline-none focus:border-accent-red/50 transition-colors"
                                        placeholder="Ej: QUESOS CREMOSOS"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Estilo de Sombras (CSS)</label>
                                        <input
                                            type="text"
                                            name="sombras"
                                            value={formData.sombras || ''}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-bold outline-none focus:border-accent-red/50 transition-colors"
                                            placeholder="Ej: drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Información Nutricional */}
                    <section className="bg-[#15181d] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />

                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400">Información Nutricional</h4>
                        </div>

                        <div className="space-y-10">
                            {/* Campos textuales */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Ingredientes</label>
                                    <textarea
                                        name="ingredientes"
                                        value={formData.ingredientes || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-colors resize-none"
                                        placeholder="Lista de ingredientes..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Venta</label>
                                    <input
                                        type="text"
                                        name="venta"
                                        value={formData.venta || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                                        placeholder="Ej: Por unidad / Por kg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Envasado</label>
                                    <input
                                        type="text"
                                        name="envasado"
                                        value={formData.envasado || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                                        placeholder="Ej: Al vacío"
                                    />
                                </div>
                            </div>

                            {/* Porción y valores diarios */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Porción</label>
                                    <input
                                        type="text"
                                        name="nutri_porcion"
                                        value={formData.nutri_porcion || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                                        placeholder="Ej: 30g"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Valores Diarios</label>
                                    <input
                                        type="text"
                                        name="nutri_valores_diarios"
                                        value={formData.nutri_valores_diarios || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                                        placeholder="Ej: basados en 2000 kcal"
                                    />
                                </div>
                            </div>

                            {/* Tabla nutricional gr / % */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Valores por Nutriente</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Valor Energético', gr: 'nutri_valor_energetico_gr', pct: 'nutri_valor_energetico_pct' },
                                        { label: 'Carbohidratos', gr: 'nutri_carbohidratos_gr', pct: 'nutri_carbohidratos_pct' },
                                        { label: 'Azúcares Totales', gr: 'nutri_azucares_totales_gr', pct: 'nutri_azucares_totales_pct' },
                                        { label: 'Azúcares Añadidos', gr: 'nutri_azucares_anadidos_gr', pct: 'nutri_azucares_anadidos_pct' },
                                        { label: 'Proteínas', gr: 'nutri_proteinas_gr', pct: 'nutri_proteinas_pct' },
                                        { label: 'Grasas Totales', gr: 'nutri_grasas_totales_gr', pct: 'nutri_grasas_totales_pct' },
                                        { label: 'Grasas Saturadas', gr: 'nutri_grasas_saturadas_gr', pct: 'nutri_grasas_saturadas_pct' },
                                        { label: 'Grasas Trans', gr: 'nutri_grasas_trans_gr', pct: 'nutri_grasas_trans_pct' },
                                        { label: 'Fibra Alimentaria', gr: 'nutri_fibra_alimentaria_gr', pct: 'nutri_fibra_alimentaria_pct' },
                                        { label: 'Sodio', gr: 'nutri_sodio_gr', pct: 'nutri_sodio_pct' },
                                    ].map(({ label, gr, pct }) => (
                                        <div key={gr} className="bg-black/30 rounded-2xl px-6 py-4 border border-white/5 grid grid-cols-[1fr_auto_auto] gap-4 items-center group hover:border-white/10 transition-all">
                                            <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">gr</span>
                                                <input
                                                    type="text"
                                                    name={gr}
                                                    value={formData[gr] || ''}
                                                    onChange={handleInputChange}
                                                    className="w-20 bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-center outline-none focus:border-emerald-500/50 transition-colors"
                                                    placeholder="—"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">%</span>
                                                <input
                                                    type="text"
                                                    name={pct}
                                                    value={formData[pct] || ''}
                                                    onChange={handleInputChange}
                                                    className="w-20 bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-center outline-none focus:border-emerald-500/50 transition-colors"
                                                    placeholder="—"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Identidad Visual & Branding */}
                    <section className="bg-[#15181d] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-white/5" />

                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Identidad Visual & Branding</h4>
                        </div>

                        <div className="space-y-12">
                            {/* Asset Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Textura Vaquitas</label>
                                    <div className="flex gap-6 items-center bg-black/30 p-6 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-colors">
                                        <div className="w-20 h-20 bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: formData.color_fondo_vaquitas }}>
                                            {(files.color_vaquitas_file || formData.color_vaquitas) && (
                                                <img
                                                    src={files.color_vaquitas_file ? URL.createObjectURL(files.color_vaquitas_file) : `${formData.color_vaquitas}`}
                                                    alt="Vaquitas"
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <button type="button" onClick={() => document.getElementById('vaquit_input').click()} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Seleccionar Archivo</button>
                                            <p className="text-[9px] text-slate-600 truncate">{files.color_vaquitas_file?.name || 'Ningún archivo seleccionado'}</p>
                                        </div>
                                        <input id="vaquit_input" type="file" name="color_vaquitas_file" onChange={handleFileChange} className="hidden" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Fondo de Logo</label>
                                    <div className="flex gap-6 items-center bg-black/30 p-6 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-colors">
                                        <div className="w-20 h-20 bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: formData.color_fondologo }}>
                                            <div className="text-[10px] font-black text-slate-800 italic uppercase"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">Este color se usará de fondo en las previsualizaciones del logo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Matrix de Colores */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[
                                    { label: 'Fondo Vaquitas', name: 'color_fondo_vaquitas' },
                                    { label: 'Letras Logo', name: 'color_letras_logo' },
                                    { label: 'Firma', name: 'color_firma' },
                                    { label: 'Detalles', name: 'color_detalles' },
                                    { label: 'Fondo Letras', name: 'color_fondo_letras' },
                                    { label: 'Queso', name: 'color_queso' },
                                    { label: 'Textos', name: 'color_texto1' },
                                    { label: 'Nombre/Peso', name: 'color_nombreypeso' },
                                    { label: 'Don Emilio', name: 'color_donemilio' },
                                    { label: 'Fondo Logo', name: 'color_fondologo' },
                                    { label: 'Fondo Cant', name: 'color_fondocantprod' },
                                    { label: 'Cant Prod', name: 'color_cantprod' },
                                ].map(color => {
                                    const currentColor = formData[color.name] || '#FFFFFFFF';
                                    const baseHex = getHexColor(currentColor);
                                    const currentAlpha = getAlphaValue(currentColor);

                                    return (
                                        <div key={color.name} className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-4 group hover:border-white/10 transition-all">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">{color.label}</label>
                                                <span className="text-[9px] font-mono font-bold text-accent-red/60">{currentAlpha}%</span>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-lg">
                                                    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: currentColor }} />
                                                    <input
                                                        type="color"
                                                        value={baseHex}
                                                        onChange={(e) => handleColorChange(color.name, e.target.value, currentAlpha)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-[2]"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={currentColor}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [color.name]: e.target.value.toUpperCase() }))}
                                                    className="flex-1 bg-transparent text-[10px] font-mono font-bold text-slate-400 outline-none uppercase"
                                                />
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentAlpha}
                                                onChange={(e) => handleColorChange(color.name, baseHex, parseInt(e.target.value))}
                                                className="w-full h-1 bg-white/5 rounded-full accent-accent-red cursor-pointer"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </form>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f1115] via-[#0f1115] to-transparent pointer-events-none flex justify-center z-10">
                <button
                    onClick={handleSubmit}
                    className="pointer-events-auto bg-accent-red hover:bg-red-600 px-16 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(239,68,68,0.4)] transition-all hover:-translate-y-1 active:scale-95 border border-white/10"
                >
                    CONSOLIDAR Y GUARDAR CATEGORÍA
                </button>
            </footer>
        </div>
    );
};

export default EditCategory;
