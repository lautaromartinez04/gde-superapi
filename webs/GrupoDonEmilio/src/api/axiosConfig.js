import axios from 'axios';
import { getToken } from './auth';

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
            // ProtectedRoute ya maneja la redirección al portal.
            // Solo logueamos para debugging.
            console.warn('[Auth] 401 recibido — token inválido o ausente.');
        }
        return Promise.reject(error);
    }
);

export default api;
