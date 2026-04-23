import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                // api.get ya tiene config.withCredentials = true en axiosConfig
                // por ende enviará la cookie automáticamente.
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('[AuthContext] Sesión no iniciada o inválida');
                setUser(null);
            } finally {
                setInitialized(true);
            }
        }
        checkAuth();
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthed: !!user,
        initialized,
    }), [user, initialized]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
