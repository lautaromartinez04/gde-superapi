import axios from 'axios';
import { getToken, redirectToLogin } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE
    ? `${import.meta.env.VITE_API_BASE}/duyamis`
    : '/api/duyamis';

// API Key para endpoints públicos (GETs del catálogo)
const API_KEY = import.meta.env.VITE_API_KEY || '<Donemilio@2026>';

// --- Axios Instance con interceptors de autenticación ---
const api = axios.create({ 
    baseURL: API_BASE,
    withCredentials: true
});

// REQUEST: agrega la X-API-Key en cada petición GET y el token JWT en mutaciones
api.interceptors.request.use((config) => {
    const token = getToken();

    if (config.method === 'get') {
        // GET requests usan x-api-key
        config.headers['x-api-key'] = API_KEY;
    }
    
    if (token) {
        // Mutaciones y Auth usan JWT Token (además de la cookie para compatibilidad)
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// RESPONSE: redirige al login del portal ante cualquier 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[Auth] Sesión expirada o inválida. Redirigiendo al portal...');
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);

// --- Transformadores de datos ---

export const transformData = (categories, products = []) => {
    return {
        Categories: categories.map(cat => ({
            ...cat,
            colors: [{
                FondoVaquitas: cat.color_fondo_vaquitas,
                Vaquitas: cat.color_vaquitas,
                LetrasLogo: cat.color_letras_logo,
                Firma: cat.color_firma,
                Detalles: cat.color_detalles,
                FondoLetras: cat.color_fondo_letras,
                Queso: cat.color_queso,
                texto1: cat.color_texto1,
                nombreypeso: cat.color_nombreypeso,
                donemilio: cat.color_donemilio,
                fondologo: cat.color_fondologo,
                fondocantprod: cat.color_fondocantprod,
                cantprod: cat.color_cantprod
            }],
            "informacion nutricional": [{
                "porción": cat.nutri_porcion,
                "Valor Energético gr": cat.nutri_valor_energetico_gr,
                "Valor Energético %": cat.nutri_valor_energetico_pct,
                "Carbohidratos gr": cat.nutri_carbohidratos_gr,
                "Carbohidratos %": cat.nutri_carbohidratos_pct,
                "Azúcares Totales gr": cat.nutri_azucares_totales_gr,
                "Azúcares Totales %": cat.nutri_azucares_totales_pct,
                "Azúcares Añadidos gr": cat.nutri_azucares_anadidos_gr,
                "Azúcares Añadidos %": cat.nutri_azucares_anadidos_pct,
                "Proteínas gr": cat.nutri_proteinas_gr,
                "Proteínas %": cat.nutri_proteinas_pct,
                "Grasas Totales gr": cat.nutri_grasas_totales_gr,
                "Grasas Totales %": cat.nutri_grasas_totales_pct,
                "Grasas Saturadas gr": cat.nutri_grasas_saturadas_gr,
                "Grasas Saturadas %": cat.nutri_grasas_saturadas_pct,
                "Grasas Trans gr": cat.nutri_grasas_trans_gr,
                "Grasas Trans %": cat.nutri_grasas_trans_pct,
                "Fibra Alimentaria gr": cat.nutri_fibra_alimentaria_gr,
                "Fibra Alimentaria %": cat.nutri_fibra_alimentaria_pct,
                "Sodio gr": cat.nutri_sodio_gr,
                "Sodio %": cat.nutri_sodio_pct,
                "Calcio gr": cat.nutri_calcio_gr,
                "Calcio %": cat.nutri_calcio_pct,
                "valores diarios": cat.nutri_valores_diarios
            }],
            products: products ? products.filter(p => p.category_id === cat.id).map(p => ({
                ...p,
                "informacion nutricional": [{
                    "porción": p.nutri_porcion,
                    "Valor Energético gr": p.nutri_valor_energetico_gr,
                    "Valor Energético %": p.nutri_valor_energetico_pct,
                    "Carbohidratos gr": p.nutri_carbohidratos_gr,
                    "Carbohidratos %": p.nutri_carbohidratos_pct,
                    "Azúcares Totales gr": p.nutri_azucares_totales_gr,
                    "Azúcares Totales %": p.nutri_azucares_totales_pct,
                    "Azúcares Añadidos gr": p.nutri_azucares_anadidos_gr,
                    "Azúcares Añadidos %": p.nutri_azucares_anadidos_pct,
                    "Proteínas gr": p.nutri_proteinas_gr,
                    "Proteínas %": p.nutri_proteinas_pct,
                    "Grasas Totales gr": p.nutri_grasas_totales_gr,
                    "Grasas Totales %": p.nutri_grasas_totales_pct,
                    "Grasas Saturadas gr": p.nutri_grasas_saturadas_gr,
                    "Grasas Saturadas %": p.nutri_grasas_saturadas_pct,
                    "Grasas Trans gr": p.nutri_grasas_trans_gr,
                    "Grasas Trans %": p.nutri_grasas_trans_pct,
                    "Fibra Alimentaria gr": p.nutri_fibra_alimentaria_gr,
                    "Fibra Alimentaria %": p.nutri_fibra_alimentaria_pct,
                    "Sodio gr": p.nutri_sodio_gr,
                    "Sodio %": p.nutri_sodio_pct,
                    "Calcio gr": p.nutri_calcio_gr,
                    "Calcio %": p.nutri_calcio_pct,
                    "valores diarios": p.nutri_valores_diarios
                }]
            })) : []
        }))
    };
};

// --- API calls (usan la instancia autenticada) ---

export const fetchAllData = async () => {
    try {
        const [catsRes, prodsRes] = await Promise.all([
            api.get('/categories/'),
            api.get('/products/')
        ]);
        return transformData(catsRes.data, prodsRes.data);
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

export const fetchCategories = async () => {
    const res = await api.get('/categories/');
    return res.data;
};

export const createCategory = async (formData) => {
    const res = await api.post('/categories/', formData);
    return res.data;
};

export const updateCategory = async (id, formData) => {
    const res = await api.put(`/categories/${id}`, formData);
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
};

export const createProduct = async (formData) => {
    const res = await api.post('/products/', formData);
    return res.data;
};

export const updateProduct = async (id, formData) => {
    const res = await api.put(`/products/${id}`, formData);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};

