import { useAuth } from '../../context/AuthContext';
import { redirectToLogin } from '../../api/auth';
import { useEffect } from 'react';

/**
 * ProtectedRoute — Guard SSO para el admin.
 * Consume el AuthContext para saber si el usuario tiene una sesión válida (cookie).
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthed, initialized } = useAuth();

    useEffect(() => {
        if (initialized && !isAuthed) {
            // Si ya inicializó y no está autenticado, redirige al portal
            redirectToLogin();
        }
    }, [initialized, isAuthed]);

    if (!initialized) {
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
                    Verificando sesión segura...
                </p>
            </div>
        );
    }

    if (!isAuthed) return null;

    return children;
};

export default ProtectedRoute;
