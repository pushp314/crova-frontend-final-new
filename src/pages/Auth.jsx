import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Clear errors when switching modes
    const switchMode = (mode) => {
        setError('');
        setMessage('');
        if (mode === 'forgot') {
            setIsForgotPassword(true);
            setIsLogin(true);
        } else if (mode === 'login') {
            setIsForgotPassword(false);
            setIsLogin(true);
        } else {
            setIsForgotPassword(false);
            setIsLogin(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await import('../api/client').then(({ default: api }) =>
                api.post('/auth/forgot-password', { email })
            );
            setMessage('If an account exists, a reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register({ name, email, password });
            }

            const from = location.state?.from?.pathname || '/shop';
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Auth error:', error);
            setError(
                error.response?.data?.message ||
                error.message ||
                'Authentication failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password UI
    if (isForgotPassword) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-medium">Reset Password</h2>
                        <p className="mt-2 text-secondary">
                            Enter your email to receive instructions
                        </p>
                    </div>

                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white hover:bg-gray-900 transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => switchMode('login')}
                            className="text-sm text-gray-600 hover:text-black"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-medium">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-secondary">
                        {isLogin ? 'Sign in to access your account' : 'Join us for exclusive access'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            {isLogin && (
                                <div className="flex justify-end mt-1">
                                    <button
                                        type="button"
                                        onClick={() => switchMode('forgot')}
                                        className="text-xs text-gray-500 hover:text-black"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                            {!isLogin && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be at least 6 characters
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-white hover:bg-gray-900 transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {isLogin ? 'Signing in...' : 'Creating account...'}
                            </>
                        ) : (
                            <>{isLogin ? 'Sign In' : 'Sign Up'}</>
                        )}
                    </button>
                </form>

                <div className="text-center space-y-4">
                    <button
                        onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                        className="text-sm underline hover:text-gray-600"
                        disabled={loading}
                    >
                        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                    </button>

                    {/* Quick test credentials */}
                    {isLogin && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                            <p className="font-medium mb-1">Test Credentials:</p>
                            <p>Admin: admin@crova.com / admin123</p>
                            <p>User: user@crova.com / user123</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
