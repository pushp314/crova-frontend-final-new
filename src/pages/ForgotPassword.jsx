import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { ArrowRight, Mail, Loader } from 'lucide-react';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: data.email });
            setEmailSent(true);
            toast.success('Password reset link sent!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen pt-[100px] flex justify-center items-center px-4 bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif mb-2">Check your email</h2>
                    <p className="text-gray-600 mb-8">
                        We've sent a password reset link to your email address. Please follow the link to reset your password.
                    </p>
                    <Link to="/auth" className="text-sm font-medium underline">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[100px] flex justify-center items-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif mb-2">Forgot Password</h1>
                    <p className="text-gray-500 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-all`}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-full font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/auth" className="text-sm text-gray-500 hover:text-black transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
