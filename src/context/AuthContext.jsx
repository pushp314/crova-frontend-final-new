import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        const handleUnauthorized = () => {
            setUser(null);
            setLoading(false);
            localStorage.removeItem('token');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const checkAuth = async () => {
        try {
            // Only check auth if we have a token
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return null;
            }

            const { data } = await api.get('/auth/me');
            setUser(data.user);
            return data.user;
        } catch (error) {
            console.log('Not authenticated');
            setUser(null);
            // Clear invalid token
            localStorage.removeItem('token');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.accessToken || data.token) {
            localStorage.setItem('token', data.accessToken || data.token);
        }
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/signup', userData);
        if (data.accessToken || data.token) {
            localStorage.setItem('token', data.accessToken || data.token);
        }
        if (data.user) {
            setUser(data.user);
        }
        return data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log('Logout error:', error);
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthModalOpen, openAuthModal, closeAuthModal, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
