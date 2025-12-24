import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    if (!isAuthModalOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const data = await login(formData.email, formData.password);
                if (data.user?.role === 'admin') {
                    navigate('/admin');
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords don't match");
                }
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            }
            closeAuthModal();
            // Reset form
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-[420px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-serif mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isLogin
                                ? 'Enter your details to access your account'
                                : 'Join us for exclusive access and rewards'}
                        </p>
                    </div>

                    <a
                        href={`${import.meta.env.VITE_API_URL}/api/v1/auth/google`}
                        className="w-full h-[50px] mb-6 flex items-center justify-center gap-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white text-gray-700 font-medium"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </a>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    className="w-full h-[50px] pl-12 pr-4 rounded-xl border border-gray-200 focus:border-black focus:ring-black/5 outline-none transition-all"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full h-[50px] pl-12 pr-4 rounded-xl border border-gray-200 focus:border-black focus:ring-black/5 outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full h-[50px] pl-12 pr-4 rounded-xl border border-gray-200 focus:border-black focus:ring-black/5 outline-none transition-all"
                            />
                        </div>

                        {!isLogin && (
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    className="w-full h-[50px] pl-12 pr-4 rounded-xl border border-gray-200 focus:border-black focus:ring-black/5 outline-none transition-all"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[50px] bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-black font-medium underline underline-offset-2 hover:text-gray-700"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
