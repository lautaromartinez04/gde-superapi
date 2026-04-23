/**
 * auth.js — Utilidades de autenticación SSO para el Admin.
 * Ahora basado enteramente en cookies (dem_access_token).
 */
import api from './axiosConfig';

const PORTAL_URL = (import.meta.env.VITE_PORTAL_URL || 'https://portal.grupodonemilio.com.ar').replace(/\/$/, '');

/**
 * Redirige al portal de login pasando la URL actual como redirectUrl.
 * No esperamos tokens en la URL de vuelta, el portal setea la cookie.
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
 * Cierra sesión invocando el endpoint de logout del portal para destruir la cookie.
 */
export const logout = async () => {
    try {
        // Intento best-effort de avisarle al portal que borre la cookie
        await api.post(`${PORTAL_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
        // Ignoramos errores
    }
    redirectToLogin();
};
