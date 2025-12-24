import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Package, ShoppingBag, MapPin, LogOut, Plus, Trash2, PenTool, CheckCircle, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'addresses'
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [loadingInquiries, setLoadingInquiries] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loadingPassword, setLoadingPassword] = useState(false);
    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchAddresses();
            fetchInquiries();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            if (data.success) {
                setOrders(data.data?.orders || data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const { data } = await api.get('/users/addresses');
            if (data.success) {
                setAddresses(data.data?.addresses || data.addresses || []);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const fetchInquiries = async () => {
        try {
            setLoadingInquiries(true);
            const { data } = await api.get('/design/my-inquiries');
            setInquiries(data.data?.inquiries || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoadingInquiries(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/users/addresses', newAddress);
            if (data.success) {
                toast.success('Address added successfully');
                fetchAddresses(); // Refresh list
                setShowAddressForm(false);
                setNewAddress({
                    fullName: '',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India',
                    isDefault: false
                });
            }
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error(error.response?.data?.message || 'Failed to add address');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/users/addresses/${id}`);
            toast.success('Address deleted');
            setAddresses(addresses.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-32 px-4 flex justify-center">
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-4 md:px-12 pb-20 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{user.name}</h2>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <Package className="w-5 h-5" />
                                    Orders
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <MapPin className="w-5 h-5" />
                                    Addresses
                                </button>
                                <button
                                    onClick={() => setActiveTab('designs')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'designs' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <PenTool className="w-5 h-5" />
                                    Custom Designs
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'security' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <Shield className="w-5 h-5" />
                                    Security
                                </button>
                            </nav>

                            <hr className="my-4 border-gray-100" />

                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-4 py-3 rounded-xl transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'orders' ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Order History
                                    </h2>
                                </div>

                                {loadingOrders ? (
                                    <div className="p-8 text-center text-gray-500">Loading orders...</div>
                                ) : orders.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                                        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                                        <Link to="/shop" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                            Browse Shop
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                    <div>
                                                        <p className="font-mono text-sm text-gray-500">#{order.orderNumber?.slice(0, 8).toUpperCase()}</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.paymentStatus === 'SUCCESS'
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                            }`}>
                                                            {order.paymentStatus === 'SUCCESS' ? 'Paid' : 'Payment Pending'}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.status === 'DELIVERED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 overflow-x-auto pb-2">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="w-16 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-200">
                                                            {(item.variant?.product?.images?.[0] || item.product?.images?.[0]) && (
                                                                <img
                                                                    src={(item.variant?.product?.images?.[0]?.imagePath || item.product?.images?.[0]?.imagePath || '').startsWith('http')
                                                                        ? (item.variant?.product?.images?.[0]?.imagePath || item.product?.images?.[0]?.imagePath)
                                                                        : `${import.meta.env.VITE_API_URL}${item.variant?.product?.images?.[0]?.imagePath || item.product?.images?.[0]?.imagePath}`}
                                                                    alt=""
                                                                    className="w-full h-full object-cover opacity-90"
                                                                />
                                                            )}
                                                            <span className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1">{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
                                                    <p className="font-medium">Total: ₹{Number(order.totalAmount).toFixed(2)}</p>
                                                    {/* <button className="text-sm font-medium underline">View Details</button> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'addresses' ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        My Addresses
                                    </h2>
                                    <button
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {showAddressForm ? 'Cancel' : 'Add New'}
                                    </button>
                                </div>

                                {showAddressForm && (
                                    <div className="p-6 bg-gray-50 border-b border-gray-100 animation-fade-in">
                                        <form onSubmit={handleAddAddress} className="space-y-4 max-w-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Full Name"
                                                    className="w-full p-3 border rounded-lg"
                                                    value={newAddress.fullName}
                                                    onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    placeholder="Phone Number"
                                                    className="w-full p-3 border rounded-lg"
                                                    value={newAddress.phone}
                                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <input
                                                placeholder="Street Address"
                                                className="w-full p-3 border rounded-lg"
                                                value={newAddress.address}
                                                onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                                required
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    placeholder="City"
                                                    className="w-full p-3 border rounded-lg"
                                                    value={newAddress.city}
                                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    placeholder="State"
                                                    className="w-full p-3 border rounded-lg"
                                                    value={newAddress.state}
                                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Postal Code"
                                                    className="w-full p-3 border rounded-lg"
                                                    value={newAddress.postalCode}
                                                    onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    placeholder="Country"
                                                    className="w-full p-3 border rounded-lg bg-gray-100"
                                                    value={newAddress.country}
                                                    disabled
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={newAddress.isDefault}
                                                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                />
                                                Set as default address
                                            </label>
                                            <button
                                                type="submit"
                                                className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                            >
                                                Save Address
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {loadingAddresses ? (
                                    <div className="p-8 text-center text-gray-500">Loading addresses...</div>
                                ) : addresses.length === 0 ? (
                                    !showAddressForm && (
                                        <div className="p-12 text-center flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <MapPin className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                                            <p className="text-gray-500">Add an address for faster checkout.</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="p-6 flex justify-between items-start hover:bg-gray-50 transition-colors group">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold">{addr.fullName}</h4>
                                                        {addr.isDefault && (
                                                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">Default</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{addr.address}</p>
                                                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                                                    <p className="text-sm text-gray-600">{addr.country}</p>
                                                    <p className="text-sm text-gray-500 mt-2">Ph: {addr.phone}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'designs' ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <PenTool className="w-5 h-5" />
                                        My Design Inquiries
                                    </h2>
                                    <Link to="/custom-design" className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700">
                                        <Plus className="w-4 h-4" />
                                        New Inquiry
                                    </Link>
                                </div>

                                {loadingInquiries ? (
                                    <div className="p-8 text-center text-gray-500">Loading inquiries...</div>
                                ) : inquiries.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <PenTool className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">No design inquiries yet</h3>
                                        <p className="text-gray-500 mb-6">Have a custom idea? Let us bring it to life.</p>
                                        <Link to="/custom-design" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                            Start Custom Design
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {inquiries.map((inq) => (
                                            <div key={inq.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900">{inq.name}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Submitted on {new Date(inq.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${inq.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        inq.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            inq.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                        }`}>
                                                        {inq.status}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 text-sm whitespace-pre-wrap border border-gray-100">
                                                    {inq.description}
                                                </div>

                                                {inq.images && inq.images.length > 0 && (
                                                    <div className="flex gap-4 overflow-x-auto pb-2 mb-4">
                                                        {inq.images.map((img, idx) => (
                                                            <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}${img}`}
                                                                    alt="reference"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {inq.adminReply && (
                                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2 flex items-center gap-2">
                                                            <CheckCircle className="w-3 h-3" /> Response from Admin
                                                        </h4>
                                                        <p className="text-sm text-blue-900 whitespace-pre-wrap">{inq.adminReply}</p>
                                                        <p className="text-xs text-blue-400 mt-2">
                                                            Received {new Date(inq.adminReplyAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'security' ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Login & Security
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <form onSubmit={handlePasswordChange} className="max-w-lg space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loadingPassword}
                                            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UserProfile;
