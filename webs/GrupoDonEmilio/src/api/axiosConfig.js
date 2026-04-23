import axios from 'axios';
import { redirectToLogin } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '<Donemilio@2026>';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true // Asegura el envío de la cookie dem_access_token al backend
});

// Interceptor para agregar headers automáticamente
api.interceptors.request.use((config) => {
    if (config.method === 'get') {
        // GET requests usan X-API-Key
        config.headers['x-api-key'] = API_KEY;
    }
    // Ya no se envía el Bearer Token por header; viaja en la cookie automáticamente
    return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[Auth] 401 recibido — redirigiendo al portal de login.');
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);

export default api;
