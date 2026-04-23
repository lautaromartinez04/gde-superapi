import { useEffect, useState } from 'react';
import { isAuthenticated, redirectToLogin, consumeRedirect, checkUrlToken } from '../../api/auth';

/**
 * ProtectedRoute — Guard de sesión para el admin de GrupoDonEmilio.
 *
 * Si hay token → renderiza los children y expone el usuario actual.
 */
const ProtectedRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        // 1. Primero chequear si el token viene en la URL (vuelta del portal)
        checkUrlToken();

        // 2. Ahora verificar si estamos autenticados
        if (isAuthenticated()) {
            // Si venimos de vuelta del portal, volver a la URL original si estaba guardada
            consumeRedirect();
            setAuthed(true);
        } else {
            // Sin token: guarda destino y redirige al portal
            redirectToLogin();
        }
        setChecking(false);
    }, []);

    // Spinner mientras se verifica — evita flash de contenido protegido
    if (checking) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#0f1115',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTopColor: '#ef4444',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    Verificando sesión...
                </p>
            </div>
        );
    }

    // No autenticado: redirigiendo (no renderizar nada)
    if (!authed) return null;

    return children;
};

export default ProtectedRoute;
