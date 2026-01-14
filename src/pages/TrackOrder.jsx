import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/client';
import toast from 'react-hot-toast';
import { Package, Search, ArrowRight, Loader } from 'lucide-react';

const TrackOrder = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setOrder(null);
        try {
            const response = await api.post('/orders/track', {
                orderId: data.orderId,
                email: data.email
            });
            setOrder(response.data.data.order);
            toast.success('Order found!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Order not found');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'text-gray-700 bg-gray-100 border border-gray-200',
            CONFIRMED: 'text-black bg-white border border-black',
            SHIPPED: 'text-black bg-gray-200 border border-gray-200',
            DELIVERED: 'text-white bg-black border border-black',
            CANCELLED: 'text-gray-400 bg-gray-50 border border-gray-200'
        };
        return colors[status] || 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-[100px] pb-24 px-4">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif mb-3">Track Your Order</h1>
                    <p className="text-gray-500">Enter your order ID and email to check the status.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="e.g. ORD-12345678"
                                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.orderId ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-all`}
                                    {...register('orderId', { required: 'Order ID is required' })}
                                />
                            </div>
                            {errors.orderId && <p className="text-red-500 text-sm mt-1">{errors.orderId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter the email used for checkout"
                                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-all`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-full font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Track Order <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                </div>

                {order && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-medium mb-1">Order Status</h2>
                                <p className="text-sm text-gray-500">#{order.orderNumber || order.id}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img src={`${import.meta.env.VITE_API_URL}${item.image}`} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">{item.productName}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="text-lg font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
