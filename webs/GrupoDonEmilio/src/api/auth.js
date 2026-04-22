/**
 * auth.js — Módulo de autenticación SSO para el Admin de GrupoDonEmilio.
 * Compatible con DEMPortal: usa la misma clave localStorage 'access_token'.
 */

// URL del portal de login (configurable por variable de entorno)
const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'https://portal.grupodonemilio.com';

// Clave de localStorage — DEBE coincidir con lo que usa DEMPortal (portal.js:8)
const TOKEN_KEY = 'access_token';

/**
 * Obtiene el token JWT del localStorage.
 * @returns {string|null} El token, o null si no existe.
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Guarda el token en localStorage.
 * @param {string} token 
 */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

/**
 * Elimina el token del localStorage (logout local).
 */
export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
};

/**
 * Verifica si hay un token almacenado (no valida firma, solo presencia).
 * @returns {boolean}
 */
export const isAuthenticated = () => !!getToken();

/**
 * Redirige al portal de login.
 * No guarda redirectUrl porque el portal ya redirige al dashboard,
 * y el admin se accede desde allí.
 */
export const redirectToLogin = () => {
    window.location.href = `${PORTAL_URL}/login`;
};

/**
 * Cierra sesión: limpia localStorage y redirige al portal.
 */
export const logout = async () => {
    const token = getToken();
    // Intenta notificar al portal del logout (opcional, best-effort)
    if (token) {
        try {
            await fetch(`${PORTAL_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch {
            // Ignoramos errores de red en el logout
        }
    }
    clearToken();
    redirectToLogin();
};

/**
 * Obtiene el usuario actual desde localStorage (seteado por el portal).
 * @returns {{ usuario: string, rol: string }|null}
 */
export const getCurrentUser = () => {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');
    if (!usuario) return null;
    return { usuario, rol };
};
