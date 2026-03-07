import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, ExternalLink, Trash2, Edit3 } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import StatusUpdateModal from '../../components/ui/StatusUpdateModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const { data } = await api.get(`/admin/orders/${id}`);
            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const { data } = await api.put(`/admin/orders/${id}/status`, { status: newStatus });
            if (data.success) {
                setOrder({ ...order, status: newStatus });
                toast.success('Order status and revenue updated');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const deleteOrder = async () => {
        try {
            const { data } = await api.delete(`/admin/orders/${id}`);
            if (data.success) {
                toast.success('Order deleted successfully');
                navigate('/admin/orders');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full font-display"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">Order not found.</p>
                <button onClick={() => navigate('/admin/orders')} className="mt-6 px-8 py-3 bg-black text-white rounded-2xl font-bold">Back to Orders</button>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
            CONFIRMED: 'bg-blue-50 text-blue-600 border-blue-100',
            PAID: 'bg-green-50 text-green-600 border-green-100',
            PROCESSING: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            SHIPPED: 'bg-purple-50 text-purple-600 border-purple-100',
            DELIVERED: 'bg-black text-white border-black',
            CANCELLED: 'bg-gray-50 text-gray-400 border-gray-100',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-3 bg-white border border-gray-100 hover:border-gray-200 shadow-sm rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-display font-black text-gray-900 leading-none">
                                ORDER #{order.orderNumber?.slice(0, 8).toUpperCase()}
                            </h1>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStatusModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-95"
                    >
                        <Edit3 className="w-4 h-4" />
                        Update Status
                    </button>
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-95"
                        title="Delete Order"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Summary & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Line Items */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-400" />
                                Line Items
                            </h2>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase">
                                {order.items?.length} Items
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6">
                                    <div className="w-20 h-28 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img
                                            src={item.variant?.product?.images?.[0]?.imagePath?.startsWith('http')
                                                ? item.variant.product.images[0].imagePath
                                                : `${import.meta.env.VITE_API_URL}${item.variant?.product?.images?.[0]?.imagePath}`}
                                            alt={item.variant?.product?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 uppercase tracking-tight leading-none mb-2">
                                            {item.variant?.product?.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 uppercase font-bold tracking-wider">
                                            <p>Size: <span className="text-black">{item.variant?.size}</span></p>
                                            <p>Qty: <span className="text-black font-mono">{item.quantity}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 text-lg leading-none mb-1">₹{item.price * item.quantity}</p>
                                        <p className="text-xs text-gray-400 font-bold">₹{item.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-gray-50/50 border-t border-gray-50 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold text-gray-900">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Shipping</span>
                                <span className="font-bold text-gray-900">₹{order.shippingCost}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-gray-200">
                                <span>Total Amount</span>
                                <span className="font-display">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="font-bold mb-8 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Order Journey
                        </h3>
                        <div className="relative">
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                            <div className="space-y-10 relative">
                                {[
                                    { status: 'PENDING', label: 'Order Placed', desc: 'Customer initiated the order' },
                                    { status: 'CONFIRMED', label: 'Confirmed', desc: 'Order verified and confirmed' },
                                    { status: 'PROCESSING', label: 'Processing', desc: 'Item being prepared/packed' },
                                    { status: 'SHIPPED', label: 'Shipped', desc: 'Handed over to courier' },
                                    { status: 'DELIVERED', label: 'Delivered', desc: 'Reached the destination' }
                                ].map((step, idx) => {
                                    const stepList = ['PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                                    const stepIdx = stepList.indexOf(order.status);
                                    const currentIdx = stepList.indexOf(step.status);
                                    const isCompleted = stepIdx >= currentIdx;
                                    const isCurrent = order.status === step.status;

                                    return (
                                        <div key={idx} className="flex gap-8 group">
                                            <div className={`w-6 h-6 rounded-full flex-shrink-0 z-10 border-[6px] transition-all ${isCompleted ? 'bg-black border-black scale-110' : 'bg-white border-gray-100 group-hover:border-gray-200'
                                                } ${isCurrent ? 'ring-8 ring-black/5' : ''}`}></div>
                                            <div className="-mt-1.5">
                                                <p className={`font-bold text-sm uppercase tracking-wider ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 font-medium">{step.desc}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Info Panels */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            Customer
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                                {order.user?.name?.[0] || 'G'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate uppercase mt-1">{order.user?.name || 'Guest User'}</p>
                                <p className="text-xs text-gray-400 font-bold truncate tracking-tight">{order.user?.email}</p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-gray-50 hover:bg-black hover:text-white text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            View Customer Profile
                        </button>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            Shipping Info
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p className="font-black text-gray-900 uppercase tracking-tight">{order.addressJson?.fullName}</p>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {order.addressJson?.address},<br />
                                {order.addressJson?.city}, {order.addressJson?.state} {order.addressJson?.postalCode},<br />
                                {order.addressJson?.country}
                            </p>
                            <div className="pt-4 mt-4 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Phone Number</p>
                                <p className="font-mono font-bold text-gray-900 tracking-widest">{order.addressJson?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            Payment
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Method</span>
                                <span className="text-xs font-black uppercase bg-black text-white px-3 py-1 rounded-xl">
                                    {order.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                                <span className={`text-[10px] font-black uppercase text-white px-3 py-1 rounded-xl shadow-lg ${order.paymentStatus === 'SUCCESS' ? 'bg-green-500 shadow-green-100' : 'bg-red-500 shadow-red-100'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.payment?.razorpayPaymentId && (
                                <div className="p-4 bg-gray-900 rounded-2xl">
                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Transaction ID</p>
                                    <p className="text-xs font-mono break-all text-white/70 leading-relaxed font-bold">
                                        {order.payment.razorpayPaymentId}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <StatusUpdateModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onUpdate={updateStatus}
                currentStatus={order.status}
                orderNumber={order.orderNumber}
            />

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={deleteOrder}
                title="Delete this Order?"
                message="Warning: This action will permanently delete all records of this order. Users will no longer be able to track it."
            />
        </div>
    );
};

export default AdminOrderDetail;
