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
 * - Guarda la URL actual en sessionStorage (mecanismo interno, por si el portal no soporta redirectUrl)
 * - Pasa la URL actual como query param ?redirectUrl= (mecanismo nativo del portal)
 */
export const redirectToLogin = () => {
    const currentUrl = window.location.href;
    // Guardamos en sessionStorage como fallback
    sessionStorage.setItem('login_redirect', currentUrl);
    // Enviamos al portal con el redirectUrl en el query param
    window.location.href = `${PORTAL_URL}/login?redirectUrl=${encodeURIComponent(currentUrl)}`;
};

/**
 * Después del login en el portal, el usuario vuelve al admin con el token en la URL.
 * Esta función extrae el token de la URL si existe y lo guarda en localStorage.
 */
export const checkUrlToken = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    const usuario = params.get('usuario');
    const rol = params.get('rol');

    if (token) {
        setToken(token);
        if (usuario) localStorage.setItem('usuario', usuario);
        if (rol) localStorage.setItem('rol', rol);

        // Limpiar la URL para que no quede el token expuesto
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
        return true;
    }
    return false;
};

/**
 * Después del login en el portal, el usuario vuelve al admin.
 * Esta función lee el destino guardado y lo usa para redirigir.
 * Llamar al inicio de ProtectedRoute cuando el token ya fue detectado.
 */
export const consumeRedirect = () => {
    const destination = sessionStorage.getItem('login_redirect');
    if (destination) {
        sessionStorage.removeItem('login_redirect');
        // Solo redirigir si es distinto de la URL actual (evitar loop)
        if (destination !== window.location.href) {
            window.location.replace(destination);
            return true; // indica que hubo redirect
        }
    }
    return false;
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
