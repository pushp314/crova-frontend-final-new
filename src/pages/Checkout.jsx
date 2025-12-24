import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { Truck, CreditCard, ShieldCheck, MapPin, Plus } from 'lucide-react';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India' // Default
    });
    const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // RAZORPAY or COD

    useEffect(() => {
        fetchAddresses();
        // Check if Razorpay script is loaded, if not load it
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/users/addresses');
            if (data.success) {
                setAddresses(data?.data?.addresses || data?.addresses || []);
                const addressesList = data?.data?.addresses || data?.addresses || [];
                if (addressesList.length > 0) {
                    setSelectedAddress(addressesList[0]);
                } else {
                    setShowAddressForm(true);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            // If API fails (maybe not implemented), default to form
            setShowAddressForm(true);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await api.post('/users/addresses', newAddress);
            if (data.success) {
                const newAddr = data?.data?.address || data?.address;
                setAddresses([...addresses, newAddr]);
                setSelectedAddress(newAddr);
                setShowAddressForm(false);
                setNewAddress({
                    fullName: '',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India'
                });
            }
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error('Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress && !showAddressForm) {
            toast.error('Please select a shipping address');
            return;
        }

        // If form is showing, use that data directly if no saved address selected
        const shippingAddress = showAddressForm ? newAddress : selectedAddress;

        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
            toast.error('Please provide a complete shipping address');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order
            const { data } = await api.post('/orders', {
                items: cart.items.map(item => ({
                    variantId: item.variant.id,
                    quantity: item.quantity
                })),
                shippingAddress,
                paymentMethod
            });

            if (!data.success) throw new Error(data.message || 'Failed to create order');

            // 2. Handle Payment
            if (paymentMethod === 'RAZORPAY') {
                const options = {
                    key: data.data.razorpay.key,
                    amount: data.data.razorpay.amount,
                    currency: data.data.razorpay.currency,
                    name: 'Crova', // Store Name
                    description: `Order #${data.data.order.orderNumber}`,
                    order_id: data.data.razorpay.orderId,
                    handler: async function (response) {
                        try {
                            const verifyRes = await api.post('/orders/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verifyRes.data.success) {
                                clearCart();
                                navigate('/order-success', {
                                    state: {
                                        order: {
                                            id: data.data.order.id,
                                            orderNumber: data.data.order.orderNumber,
                                            totalAmount: data.data.order.totalAmount,
                                            paymentStatus: 'SUCCESS'
                                        }
                                    }
                                });
                            }
                        } catch (err) {
                            console.error('Payment verification failed:', err);
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: shippingAddress.fullName,
                        contact: shippingAddress.phone,
                        email: 'user@example.com' // Should fetch from user profile
                    },
                    theme: {
                        color: '#000000'
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(`Payment Failed: ${response.error.description}`);
                });
                rzp1.open();
            } else {
                // COD
                clearCart();
                navigate('/order-success', {
                    state: {
                        order: {
                            id: data.data.order.id,
                            orderNumber: data.data.order.orderNumber,
                            totalAmount: data.data.order.totalAmount,
                            paymentStatus: 'PENDING'
                        }
                    }
                });
            }

        } catch (error) {
            console.error('Order placement error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="underline">Start Shopping</button>
            </div>
        );
    }

    const subtotal = cart.items.reduce((acc, item) => acc + (item.quantity * parseFloat(item.variant?.product?.price || 0)), 0);
    const shipping = subtotal > 4999 ? 0 : 50;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen pt-32 px-4 md:px-12 pb-20 bg-gray-50">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Address & Payment */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Shipping Address Section */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Truck className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Shipping Address</h2>
                        </div>

                        {!showAddressForm && addresses.length > 0 ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-black ring-1 ring-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <p className="font-semibold">{addr.fullName}</p>
                                            <p className="text-sm text-gray-600">{addr.address}</p>
                                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                                            <p className="text-sm text-gray-600">{addr.phone}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { setSelectedAddress(null); setShowAddressForm(true); }}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                                >
                                    <Plus className="w-4 h-4" /> Add New Address
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="Full Name"
                                        className="w-full p-3 border rounded-lg"
                                        value={newAddress.fullName}
                                        onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                    />
                                    <input
                                        placeholder="Phone Number"
                                        className="w-full p-3 border rounded-lg"
                                        value={newAddress.phone}
                                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    />
                                </div>
                                <input
                                    placeholder="Street Address"
                                    className="w-full p-3 border rounded-lg"
                                    value={newAddress.address}
                                    onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="City"
                                        className="w-full p-3 border rounded-lg"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                    <input
                                        placeholder="State"
                                        className="w-full p-3 border rounded-lg"
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="ZIP Code"
                                        className="w-full p-3 border rounded-lg"
                                        value={newAddress.postalCode}
                                        onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                    />
                                    <input
                                        placeholder="Country"
                                        className="w-full p-3 border rounded-lg bg-gray-50"
                                        value={newAddress.country}
                                        disabled
                                    />
                                </div>
                                {addresses.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressForm(false)}
                                        className="text-sm text-gray-500 hover:text-black"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Payment Method</h2>
                        </div>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'RAZORPAY' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="RAZORPAY"
                                    checked={paymentMethod === 'RAZORPAY'}
                                    onChange={() => setPaymentMethod('RAZORPAY')}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <span className="font-medium">Pay Online (Razorpay)</span>
                                    <p className="text-xs text-gray-500">Credit Card, Debit Card, UPI, NetBanking</p>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'COD' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => setPaymentMethod('COD')}
                                    className="mr-3"
                                />
                                <div>
                                    <span className="font-medium">Cash on Delivery</span>
                                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-32">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                    <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                        {/* Ideally show real image */}
                                        {item.variant?.product?.images?.[0] ? (
                                            <img
                                                src={item.variant.product.images[0].imagePath.startsWith('http')
                                                    ? item.variant.product.images[0].imagePath
                                                    : `${import.meta.env.VITE_API_URL}${item.variant.product.images[0].imagePath}`}
                                                className="object-cover w-full h-full"
                                                alt=""
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                        <span className="absolute top-0 right-0 bg-black text-white text-xs px-1">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium truncate">{item.variant?.product?.name || 'Product'}</p>
                                        <p className="text-gray-500">{item.variant?.size} / {item.variant?.color}</p>
                                        <p className="font-medium mt-1">₹{(item.variant?.product?.price || 0) * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-black text-white hover:bg-gray-900 transition-colors rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {loading ? 'Processing...' : `Pay ₹${total}`}
                            {!loading && <ShieldCheck className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
