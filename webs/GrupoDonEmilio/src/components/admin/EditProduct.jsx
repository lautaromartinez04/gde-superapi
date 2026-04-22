import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAllData, createProduct, updateProduct } from '../../api/duyamis_api';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { adminSwal as Swal } from './swalConfig';
import { useAdminHeader } from './AdminLayout';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderState } = useAdminHeader();
    const isUpdate = !!id;

    const [data, setData] = useState({ Categories: [] });
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        category_id: '',
        description: '',
        width: '100%',
        venta: '',
        envasado: '',
        logo: 'null',
        color_vaquitas: 'null'
    });
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [isOptionalExpanded, setIsOptionalExpanded] = useState(false);
    const [isNutritionalExpanded, setIsNutritionalExpanded] = useState(false);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const allData = await fetchAllData();
                setData(allData);
                if (isUpdate) {
                    const product = allData.Categories.flatMap(c => c.products).find(p => p.id === parseInt(id));
                    if (product) {
                        setFormData(product);
                    } else {
                        Swal.fire('Error', 'Producto no encontrado', 'error');
                        navigate('/admin/duyamis/products');
                    }
                }
            } catch (error) {
                Swal.fire('Error', 'Error al cargar datos: ' + error.message, 'error');
            }
            setLoading(false);
        };
        loadAllData();
    }, [id, isUpdate, navigate]);

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
            if (isUpdate) await updateProduct(id, submissionData);
            else await createProduct(submissionData);

            Swal.fire({
                title: '¡Guardado!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1a1d23',
                color: '#fff'
            });
            navigate('/admin/duyamis/products');
        } catch (error) {
            Swal.fire('Error', 'Error al guardar producto: ' + error.message, 'error');
        }
    }, [formData, files, id, isUpdate, navigate]);

    useEffect(() => {
        setHeaderState({
            title: isUpdate ? 'Editando Producto' : 'Creando Producto',
            subtitle: formData.name || 'Nuevo Registro',
            actions: (
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/admin/duyamis/products')}
                        className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
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
        <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-500">
            <div className="w-10 h-10 border-[3px] border-red-500/10 border-t-red-500 rounded-full animate-spin" />
            <span className="text-sm">Cargando editor...</span>
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
                            {/* Columna Izquierda: Imagen y Ancho */}
                            <div className="w-full lg:w-72 space-y-8 flex flex-col items-center">
                                <div className="relative group w-full aspect-square max-w-[280px] bg-black rounded-[2.5rem] border border-white/10 overflow-hidden flex items-center justify-center p-6 shadow-inner">
                                    {formData.image && formData.image !== 'null' ? (
                                        <img
                                            src={files.image_file ? URL.createObjectURL(files.image_file) : `${formData.image}?t=${new Date().getTime()}`}
                                            alt="Preview"
                                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="text-slate-700 font-black italic text-xs uppercase tracking-tighter">Sin Imagen</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button type="button" onClick={() => document.getElementById('image_input').click()} className="w-32 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors">CAMBIAR</button>
                                        <button type="button" onClick={() => { setFormData(prev => ({ ...prev, image: 'null' })); setFiles(prev => ({ ...prev, image_file: null })); }} className="w-32 py-2.5 bg-accent-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors">ELIMINAR</button>
                                    </div>
                                    <input id="image_input" type="file" name="image_file" onChange={handleFileChange} className="hidden" />
                                </div>

                                <div className="w-full space-y-3 bg-black/20 p-6 rounded-3xl border border-white/5">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Ancho Etiqueta</span>
                                        <span className="text-accent-red">{formData.width || '100%'}</span>
                                    </div>
                                    <input
                                        type="range"
                                        name="width"
                                        min="0"
                                        max="100"
                                        value={parseInt(formData.width) || 100}
                                        onChange={(e) => setFormData(prev => ({ ...prev, width: `${e.target.value}%` }))}
                                        className="w-full accent-accent-red h-1.5 bg-slate-800 rounded-full cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[8px] font-bold text-slate-700">
                                        <span>ESTRECHO</span>
                                        <span>ANCHO</span>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Inputs */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                <div className="col-span-full space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-2xl font-black italic uppercase tracking-tighter outline-none focus:border-accent-red/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Peso / Cantidad</label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={formData.quantity || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-lg font-bold outline-none focus:border-accent-red/50 transition-colors"
                                        placeholder="Ej: 500g"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Categoría del Producto</label>
                                    <div className="relative">
                                        <select
                                            name="category_id"
                                            value={formData.category_id || ''}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-lg font-bold outline-none focus:border-accent-red/50 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1a1d23]">Seleccionar...</option>
                                            {data.Categories.map(c => <option key={c.id} value={c.id} className="bg-[#1a1d23]">{c.name}</option>)}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-[10px]">▼</div>
                                    </div>
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-base font-medium min-height-[160px] resize-none outline-none focus:border-accent-red/50 transition-colors leading-relaxed"
                                        placeholder="Descripción detallada del producto..."
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Atributos Opcionales */}
                    <section className="bg-[#15181d] rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setIsOptionalExpanded(!isOptionalExpanded)}
                            className="w-full p-8 flex justify-between items-center group transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOptionalExpanded ? 'bg-accent-red text-white' : 'bg-white/5 text-slate-500'}`}>
                                    <span className="text-[10px] font-black italic">!</span>
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 group-hover:text-slate-200">Atributos Opcionales</h4>
                            </div>
                            <motion.span
                                animate={{ rotate: isOptionalExpanded ? 180 : 0 }}
                                className="text-slate-600 text-[10px]"
                            >▼</motion.span>
                        </button>

                        <AnimatePresence>
                            {isOptionalExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-8 pb-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tipo de Venta</label>
                                            <input type="text" name="venta" value={formData.venta || ''} onChange={handleInputChange} className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 font-bold outline-none focus:border-accent-red/50" placeholder="Ej: Al peso" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Envasado</label>
                                            <input type="text" name="envasado" value={formData.envasado || ''} onChange={handleInputChange} className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 font-bold outline-none focus:border-accent-red/50" placeholder="Ej: Vacío" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* Información Nutricional */}
                    <section className="bg-[#15181d] rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setIsNutritionalExpanded(!isNutritionalExpanded)}
                            className="w-full p-8 flex justify-between items-center group transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isNutritionalExpanded ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-slate-500'}`}>
                                    <span className="text-[10px] font-black italic">N</span>
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 group-hover:text-slate-200">Información Nutricional</h4>
                            </div>
                            <motion.span
                                animate={{ rotate: isNutritionalExpanded ? 180 : 0 }}
                                className="text-slate-600 text-[10px]"
                            >▼</motion.span>
                        </button>

                        <AnimatePresence>
                            {isNutritionalExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-8 pb-10"
                                >
                                    <div className="space-y-12 pt-4">
                                        <div className="space-y-2 w-full md:w-1/3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Porción de Referencia</label>
                                            <input type="text" name="nutri_porcion" value={formData.nutri_porcion || ''} onChange={handleInputChange} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 font-bold outline-none focus:border-green-500/30" placeholder="Ej: 30g (1 rebanada)" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                                            {[
                                                { label: 'Valor Energético (Kcal/kJ)', gr: 'nutri_valor_energetico_gr', pct: 'nutri_valor_energetico_pct' },
                                                { label: 'Carbohidratos (g)', gr: 'nutri_carbohidratos_gr', pct: 'nutri_carbohidratos_pct' },
                                                { label: 'Azúcares Totales (g)', gr: 'nutri_azucares_totales_gr', pct: 'nutri_azucares_totales_pct' },
                                                { label: 'Azúcares Añadidos (g)', gr: 'nutri_azucares_anadidos_gr', pct: 'nutri_azucares_anadidos_pct' },
                                                { label: 'Proteínas (g)', gr: 'nutri_proteinas_gr', pct: 'nutri_proteinas_pct' },
                                                { label: 'Grasas Totales (g)', gr: 'nutri_grasas_totales_gr', pct: 'nutri_grasas_totales_pct' },
                                                { label: 'Grasas Saturadas (g)', gr: 'nutri_grasas_saturadas_gr', pct: 'nutri_grasas_saturadas_pct' },
                                                { label: 'Grasas Trans (g)', gr: 'nutri_grasas_trans_gr', pct: 'nutri_grasas_trans_pct' },
                                                { label: 'Fibra Alimentaria (g)', gr: 'nutri_fibra_alimentaria_gr', pct: 'nutri_fibra_alimentaria_pct' },
                                                { label: 'Sodio (mg)', gr: 'nutri_sodio_gr', pct: 'nutri_sodio_pct' },
                                                { label: 'Calcio (mg)', gr: 'nutri_calcio_gr', pct: 'nutri_calcio_pct' },
                                            ].map(row => (
                                                <div key={row.label} className="space-y-2">
                                                    <div className="flex justify-between px-2">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">{row.label}</label>
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">% V.D.</label>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <input type="text" name={row.gr} value={formData[row.gr] || ''} onChange={handleInputChange} className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 text-sm font-bold text-center outline-none focus:border-green-500/30" placeholder="---" />
                                                        <input type="text" name={row.pct} value={formData[row.pct] || ''} onChange={handleInputChange} className="w-20 bg-black/40 border border-white/5 rounded-xl p-3 text-sm font-bold text-center outline-none focus:border-green-500/30" placeholder="0%" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nota de Valores Diarios (Pie de Tabla)</label>
                                            <textarea
                                                name="nutri_valores_diarios"
                                                value={formData.nutri_valores_diarios || ''}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm font-medium italic text-slate-400 resize-none h-24 outline-none focus:border-green-500/30 leading-relaxed"
                                                placeholder="*Valores Diarios con base a una dieta de 2000 kcal u 8400 kJ..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </form>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f1115] via-[#0f1115] to-transparent pointer-events-none flex justify-center z-10">
                <button
                    onClick={handleSubmit}
                    className="pointer-events-auto bg-accent-red hover:bg-red-600 px-16 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(239,68,68,0.4)] transition-all hover:-translate-y-1 active:scale-95 border border-white/10"
                >
                    FINALIZAR Y GUARDAR PRODUCTO
                </button>
            </footer>
        </div>
    );
};

export default EditProduct;
