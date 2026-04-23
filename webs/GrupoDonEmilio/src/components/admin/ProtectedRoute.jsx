import { useEffect, useState } from 'react';
import { isAuthenticated, redirectToLogin, checkUrlToken } from '../../api/auth';

/**
 * ProtectedRoute — Guard SSO para el admin.
 *
 * Flujo:
 *  1. Al cargar, revisa si el portal redirigió con ?access_token=... en la URL → lo guarda.
 *  2. Si hay token → renderiza children.
 *  3. Si no hay token → redirige al portal con ?redirectUrl= apuntando de vuelta acá.
 */
const ProtectedRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        // 1. Capturar token si viene en la URL (vuelta del portal)
        checkUrlToken();

        // 2. Verificar autenticación
        if (isAuthenticated()) {
            setAuthed(true);
            setChecking(false);
        } else {
            // 3. Sin token → redirigir al portal con redirectUrl
            redirectToLogin();
            // No seteamos checking=false para evitar flash de contenido
        }
    }, []);

    // Spinner mientras se verifica / redirige
    if (checking) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', backgroundColor: '#0f1115',
                flexDirection: 'column', gap: '1rem'
            }}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTopColor: '#ef4444', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    Verificando sesión...
                </p>
            </div>
        );
    }

    if (!authed) return null;

    return children;
};

export default ProtectedRoute;
