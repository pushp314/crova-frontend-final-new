import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            if (token) {
                localStorage.setItem('token', token);
                const user = await checkAuth();
                if (user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/auth?error=failed');
            }
        };

        handleAuth();
    }, [searchParams, navigate, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium">Authenticating...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
