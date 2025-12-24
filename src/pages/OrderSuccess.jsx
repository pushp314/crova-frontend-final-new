import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {}; // Expecting order object from redirect

    useEffect(() => {
        if (!order) {
            navigate('/shop');
            return;
        }

        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, [order, navigate]);

    if (!order) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-display font-bold mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. We've received your order and will begin processing it shortly.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Order Number</span>
                        <span className="font-mono font-medium">#{order.orderNumber?.slice(0, 8).toUpperCase() || order.id?.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Payment Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {order.paymentStatus || 'PENDING'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold">Total Amount</span>
                        <span className="font-bold text-lg">₹{order.totalAmount}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        to="/profile"
                        className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group"
                    >
                        View Order Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                        to="/shop"
                        className="w-full bg-white text-black border border-gray-200 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
