import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component - redirects to auth if user is not logged in
 * Use this to wrap routes that require authentication
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                // Redirect to login with return path
                navigate('/auth', {
                    state: { from: window.location.pathname },
                    replace: true
                });
            } else if (requireAdmin && user.role !== 'ADMIN') {
                // Redirect non-admin users
                navigate('/', { replace: true });
            }
        }
    }, [user, loading, requireAdmin, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!user || (requireAdmin && user.role !== 'ADMIN')) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
