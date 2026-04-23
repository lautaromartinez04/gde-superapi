/**
 * auth.js — Utilidades de autenticación SSO para el Admin.
 */
import api from './axiosConfig';

const PORTAL_URL = (import.meta.env.VITE_PORTAL_URL || 'https://portal.grupodonemilio.com.ar').replace(/\/$/, '');
const TOKEN_KEY = 'access_token';

export const getToken = () => {
    const t = localStorage.getItem(TOKEN_KEY);
    return (t && t !== 'null' && t !== 'undefined') ? t : null;
};

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const checkUrlToken = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');

    if (token) {
        setToken(token);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return true;
    }
    return false;
};

/**
 * Redirige al portal de login pasando la URL actual como redirectUrl.
 */
export const redirectToLogin = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const cleanCurrentUrl = `${origin}${pathname}`;

    const portalLoginUrl = `${PORTAL_URL}/login?redirectUrl=${encodeURIComponent(cleanCurrentUrl)}`;
    
    console.info(`[Auth] Redirigiendo al portal: ${portalLoginUrl}`);
    window.location.href = portalLoginUrl;
};

/**
 * Cierra sesión invocando el endpoint de logout del portal y limpiando local.
 */
export const logout = async () => {
    try {
        await api.post(`${PORTAL_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
        // Ignoramos errores
    }
    clearToken();
    redirectToLogin();
};
