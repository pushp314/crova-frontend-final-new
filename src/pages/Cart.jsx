import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, loading } = useCart();
    const { user, openAuthModal } = useAuth();
    const [updatingItems, setUpdatingItems] = React.useState(new Set());

    const handleUpdateQuantity = async (variantId, newQuantity) => {
        setUpdatingItems(prev => new Set(prev).add(variantId));
        await updateQuantity(variantId, newQuantity);
        setUpdatingItems(prev => {
            const next = new Set(prev);
            next.delete(variantId);
            return next;
        });
    };

    const handleRemove = async (variantId) => {
        setUpdatingItems(prev => new Set(prev).add(variantId));
        await removeFromCart(variantId);
        setUpdatingItems(prev => {
            const next = new Set(prev);
            next.delete(variantId);
            return next;
        });
    };

    if (loading && !cart) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-display mb-4">Your shopping bag is waiting</h2>
                <p className="text-secondary mb-8 text-center max-w-md">Login to see the items you've added and proceed to checkout.</p>
                <button
                    onClick={openAuthModal}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                    Sign In
                </button>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-display mb-4">Your cart is empty</h2>
                <Link to="/shop" className="underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-12 pb-24 md:pb-20">
            <h1 className="text-4xl font-display mb-12">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-6 py-6 border-b">
                            <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                                {item.product?.images?.[0] ? (
                                    <img
                                        src={getImageUrl(item.product.images[0].imagePath)}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-medium">{item.product?.name || 'Product Unavailable'}</h3>
                                    <p>₹{(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="text-sm text-secondary mb-4">
                                    {item.variant ? `${item.variant.size} / ${item.variant.color}` : 'Variant Unavailable'}
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-200">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                                            disabled={updatingItems.has(item.variantId) || !item.variant}
                                            className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 min-w-[3ch] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                                            disabled={updatingItems.has(item.variantId) || !item.variant}
                                            className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.variantId)}
                                        disabled={updatingItems.has(item.variantId)}
                                        className="text-sm underline text-red-500 disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 sticky top-32">
                        <h3 className="text-xl font-medium mb-6">Order Summary</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cart.items.reduce((acc, item) => acc + (item.quantity * parseFloat(item.product?.price || 0)), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg pt-4 border-t">
                                <span>Total</span>
                                <span>₹{cart.items.reduce((acc, item) => acc + (item.quantity * parseFloat(item.product?.price || 0)), 0).toFixed(2)}</span>
                            </div>
                        </div>
                        {user ? (
                            <Link
                                to="/checkout"
                                className="block w-full text-center py-4 bg-black text-white hover:bg-gray-900 transition-colors"
                            >
                                Proceed to Checkout
                            </Link>
                        ) : (
                            <button
                                onClick={openAuthModal}
                                className="block w-full text-center py-4 bg-black text-white hover:bg-gray-900 transition-colors"
                            >
                                Login to Checkout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
