const API_BASE = import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/duyamis') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/duyamis`)
    : '/api/duyamis';

/**
 * Transforma los datos de la API (planos) a la estructura anidada que espera el frontend.
 * @param {Array} categories - Lista de categorías con sus campos de color.
 * @param {Array} products - Lista de todos los productos (opcional si se cargan por separado).
 */
export const transformData = (categories, products = []) => {
    return {
        Categories: categories.map(cat => {
            // Reconstruir el objeto de colores
            const colors = [{
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
            }];

            // Parsear información nutricional si existe y es string (depende de cómo se guarde en DB)
            // En nuestra migración guardamos campos individuales, así que reconstruimos el array para los componentes
            const infoNutri = [{
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
            }];

            return {
                ...cat,
                colors,
                "informacion nutricional": infoNutri,
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
            };
        })
    };
};

export const fetchAllData = async () => {
    try {
        const [catsRes, prodsRes] = await Promise.all([
            fetch(`${API_BASE}/categories/`, {
                headers: { 'x-api-key': '<Donemilio@2026>' }
            }),
            fetch(`${API_BASE}/products/`, {
                headers: { 'x-api-key': '<Donemilio@2026>' }
            })
        ]);

        if (!catsRes.ok || !prodsRes.ok) throw new Error('Error al cargar datos de la API');

        const categories = await catsRes.json();
        const products = await prodsRes.json();

        return transformData(categories, products);
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

export const fetchCategories = async () => {
    const res = await fetch(`${API_BASE}/categories/`, {
        headers: { 'x-api-key': '<Donemilio@2026>' }
    });
    if (!res.ok) throw new Error('Error al cargar categorías');
    return await res.json();
};

// --- Categoires CRUD ---

export const createCategory = async (formData) => {
    const res = await fetch(`${API_BASE}/categories/`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return await res.json();
};

export const updateCategory = async (id, formData) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!res.ok) throw new Error('Error al actualizar categoría');
    return await res.json();
};

export const deleteCategory = async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar categoría');
    return await res.json();
};

// --- Products CRUD ---

export const createProduct = async (formData) => {
    const res = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return await res.json();
};

export const updateProduct = async (id, formData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return await res.json();
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return await res.json();
};
