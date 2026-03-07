import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Filter, Trash2, Package, RefreshCw } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import StatusUpdateModal from '../../components/ui/StatusUpdateModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal states
    const [statusModal, setStatusModal] = useState({ isOpen: false, order: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = { limit: 50 }; // Get more for better management
            if (statusFilter) params.status = statusFilter;

            const { data } = await api.get('/admin/orders', { params });
            // The API returns { success: true, orders: [...] }
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            toast.success('Status updated for revenue tracking');
            // Refresh local state or refetch
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update status');
        }
    };

    const deleteOrder = async (id) => {
        try {
            const { data } = await api.delete(`/admin/orders/${id}`);
            if (data.success) {
                toast.success('Order deleted successfully');
                setOrders(prev => prev.filter(o => o.id !== id));
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error(error.response?.data?.message || 'Failed to delete order');
        }
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage fulfillment and track revenue status</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order #, name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition-all outline-none"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none font-medium cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        {['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                {loading && orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                        <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                        <p>Loading your orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                        <Package className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No orders found matching your criteria</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-all group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 font-mono text-sm leading-none tracking-tighter">
                                                #{order.orderNumber?.slice(0, 8).toUpperCase()}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-gray-900">{order.user?.name || 'Guest'}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{order._count?.items || 0} ITEMS</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${order.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {order.paymentMethod} / {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setStatusModal({ isOpen: true, order })}
                                                className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                    className="p-2.5 hover:bg-black hover:text-white rounded-xl transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, orderId: order.id })}
                                                    className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <StatusUpdateModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal({ isOpen: false, order: null })}
                onUpdate={(newStatus) => updateOrderStatus(statusModal.order.id, newStatus)}
                currentStatus={statusModal.order?.status}
                orderNumber={statusModal.order?.orderNumber}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
                onConfirm={() => deleteOrder(deleteModal.orderId)}
                title="Delete Order?"
                message="This will permanently remove the order from the database. This action is irreversible."
            />
        </div>
    );
};

export default AdminOrders;
