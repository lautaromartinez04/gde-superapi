import axios from 'axios';
import { getToken, clearToken, redirectToLogin } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '<Donemilio@2026>';

const api = axios.create({
    baseURL: API_BASE
});

// Interceptor para agregar headers automáticamente
api.interceptors.request.use((config) => {
    const token = getToken();

    if (config.method === 'get') {
        // GET requests usan X-API-Key
        config.headers['x-api-key'] = API_KEY;
    } else if (token) {
        // Mutaciones (POST, PUT, DELETE, PATCH) usan JWT Token
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[Auth] 401 recibido — redirigiendo al portal de login.');
            // Si el backend nos rechaza por falta de autenticación, limpiamos y redirigimos
            clearToken();
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);

export default api;
