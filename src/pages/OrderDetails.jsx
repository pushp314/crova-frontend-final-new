import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            // toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center">
                < शॉपिंगBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-8">We couldn't find the order you're looking for.</p>
                <Link to="/profile" className="px-8 py-3 bg-black text-white rounded-full font-medium">
                    Back to My Account
                </Link>
            </div>
        );
    }

    const steps = [
        { status: 'PENDING', label: 'Order Placed', icon: Clock },
        { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
        { status: 'PROCESSING', label: 'Processing', icon: Package },
        { status: 'SHIPPED', label: 'Shipped', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
    ];

    const currentStepIdx = steps.findIndex(s => s.status === order.status);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                <Link to="/profile" className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Order History
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Order Details</h1>
                        <p className="text-gray-500 mt-1 uppercase tracking-tight font-mono text-sm pt-2">
                            ID: #{order.orderNumber?.slice(0, 10).toUpperCase()}
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10">
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Tracking & Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Tracker */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                            <div className="min-w-[600px] flex justify-between relative">
                                {/* Connector Line */}
                                <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 -z-0"></div>
                                {steps.map((step, idx) => {
                                    const Icon = step.icon;
                                    const isCompleted = currentStepIdx >= idx;
                                    const isActive = currentStepIdx === idx;

                                    return (
                                        <div key={idx} className="flex flex-col items-center relative z-10 w-24">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400'
                                                } ${isActive ? 'ring-4 ring-black/10 scale-110' : ''}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mt-3 text-center transition-colors ${isCompleted ? 'text-black' : 'text-gray-300'}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold">Ordered Items</h3>
                                <span className="text-xs text-gray-500">{order.items?.length} Items</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="p-6 flex gap-6">
                                        <div className="w-20 h-28 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img
                                                src={item.variant?.product?.images?.[0]?.imagePath?.startsWith('http')
                                                    ? item.variant.product.images[0].imagePath
                                                    : `${import.meta.env.VITE_API_URL}${item.variant?.product?.images?.[0]?.imagePath}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg uppercase tracking-tight leading-none mb-2">{item.variant?.product?.name}</h4>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500 uppercase tracking-wide">
                                                <p>Size: <span className="text-black font-bold">{item.variant?.size}</span></p>
                                                <p>Qty: <span className="text-black font-bold">{item.quantity}</span></p>
                                                {item.customColor && (
                                                    <p>Cloth: <span className="text-black font-bold">{item.customColor}</span></p>
                                                )}
                                            </div>
                                            <p className="mt-4 font-bold text-gray-900">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-gray-50/50 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium text-gray-900">₹{order.shippingCost}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-100">
                                    <span>Total Amount</span>
                                    <span className="font-display">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Address & Payment */}
                    <div className="space-y-8">
                        {/* Delivery Address */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Delivery Address
                            </h3>
                            <div className="text-sm space-y-1 text-gray-600 leading-relaxed">
                                <p className="font-bold text-black uppercase">{order.addressJson?.fullName}</p>
                                <p>{order.addressJson?.address}</p>
                                <p>{order.addressJson?.city}, {order.addressJson?.state}</p>
                                <p>{order.addressJson?.postalCode}, {order.addressJson?.country}</p>
                                <p className="pt-4 font-bold text-black tracking-widest text-[11px]">PH: {order.addressJson?.phone}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                    <span className="text-xs text-gray-500 uppercase font-bold">Method</span>
                                    <span className="text-xs font-bold uppercase">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                    <span className="text-xs text-gray-500 uppercase font-bold">Status</span>
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${order.paymentStatus === 'SUCCESS' ? 'bg-black border-black text-white' : 'bg-white text-gray-400 border-gray-200'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl shadow-black/20">
                            <h3 className="font-bold mb-2">Need help?</h3>
                            <p className="text-sm text-gray-400 mb-6">If you have any issues with your order, please contact our support.</p>
                            <Link to="/contact" className="w-full inline-block text-center py-3 bg-white text-black rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
