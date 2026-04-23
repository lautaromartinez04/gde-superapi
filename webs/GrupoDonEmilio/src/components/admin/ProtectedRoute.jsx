/**
 * ProtectedRoute — Sin redirección forzada.
 * El token se carga manualmente desde el panel TOKEN del sidebar.
 */
const ProtectedRoute = ({ children }) => {
    return children;
};

export default ProtectedRoute;
