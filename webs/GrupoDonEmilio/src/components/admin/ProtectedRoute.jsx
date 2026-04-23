import { useEffect, useState } from 'react';
import { isAuthenticated, redirectToLogin } from '../../api/auth';

/**
 * ProtectedRoute — Guard SSO para el admin.
 *
 * El token SSO ya fue capturado sincrónicamente en main.jsx antes del render.
 * Aquí solo verificamos si hay token válido en localStorage y redirigimos si no.
 */
const ProtectedRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            setAuthed(true);
            setChecking(false);
        } else {
            // Sin token → redirigir al portal con redirectUrl apuntando de vuelta acá
            redirectToLogin();
            // checking queda true para no mostrar flash de contenido mientras redirige
        }
    }, []);

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

