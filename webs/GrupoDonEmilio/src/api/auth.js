/**
 * auth.js — Módulo de autenticación SSO para el Admin de GrupoDonEmilio.
 * Compatible con DEMPortal: usa la misma clave localStorage 'access_token'.
 */

// URL del portal de login (configurable por variable de entorno)
const PORTAL_URL = (import.meta.env.VITE_PORTAL_URL || 'https://portal.grupodonemilio.com.ar').replace(/\/$/, '');

// Clave de localStorage — DEBE coincidir con lo que usa DEMPortal
const TOKEN_KEY = 'access_token';

// ─────────────────────────────────────────────────────────────────────────────
// Getters / Setters
// ─────────────────────────────────────────────────────────────────────────────

/** Obtiene el token JWT del localStorage. */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Guarda el token en localStorage. */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

/** Elimina token y datos de sesión del localStorage. */
export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
};

/** Verifica si hay un token almacenado (no valida firma, solo presencia). */
export const isAuthenticated = () => !!getToken();

/** Obtiene el usuario actual desde localStorage. */
export const getCurrentUser = () => {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');
    if (!usuario) return null;
    return { usuario, rol };
};

// ─────────────────────────────────────────────────────────────────────────────
// SSO Token capture
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Captura el token SSO de la URL si viene en los query params.
 * Debe llamarse lo antes posible (en main.jsx, antes del render).
 * @returns {boolean} true si se capturó un token nuevo.
 */
export const checkUrlToken = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    const usuario = params.get('usuario');
    const rol = params.get('rol');

    if (token) {
        setToken(token);
        if (usuario) localStorage.setItem('usuario', usuario);
        if (rol)     localStorage.setItem('rol', rol);

        // Limpiar la URL: quedarnos solo con el pathname, sin exponer el token
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        return true;
    }
    return false;
};

// ─────────────────────────────────────────────────────────────────────────────
// Redirect al portal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Redirige al portal de login pasando la URL actual como redirectUrl.
 * La URL que se pasa es la pathname limpia (sin tokens ni query params previos).
 *
 * El portal redirigirá de vuelta a:
 *   <redirectUrl>?access_token=TOKEN&usuario=JUAN&rol=ADMIN
 */
export const redirectToLogin = () => {
    // Usar pathname limpio para no exponer query params viejos en el redirectUrl
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const cleanCurrentUrl = `${origin}${pathname}`;

    const portalLoginUrl = `${PORTAL_URL}/login?redirectUrl=${encodeURIComponent(cleanCurrentUrl)}`;

    console.info(`[Auth] Sin token — redirigiendo al portal: ${portalLoginUrl}`);
    window.location.href = portalLoginUrl;
};

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cierra sesión: limpia localStorage y redirige al portal.
 */
export const logout = async () => {
    const token = getToken();
    // Notificar al portal del logout (best-effort)
    if (token) {
        try {
            await fetch(`${PORTAL_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch {
            // Ignoramos errores de red — seguimos con el logout local
        }
    }
    clearToken();
    redirectToLogin();
};
