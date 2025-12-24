import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, useRemoveFromWishlist } from '../hooks/queries/useWishlist';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const { user } = useAuth();
    const { data, isLoading } = useWishlist({ enabled: !!user });
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();
    const { addToCart } = useCart();

    const wishlistItems = data?.data?.wishlist?.items || [];

    const handleAddToCart = async (product) => {
        // Just add the first variant for now (since logic implies user chooses variant on product page usually)
        // Or redirect to product page
        window.location.href = `/product/${product.slug}`;
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-[100px] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-medium mb-4">Please log in to view your wishlist</h2>
                    <Link to="/auth" className="px-6 py-2 bg-black text-white rounded-full">Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[100px] pb-24 px-4">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-serif">My Wishlist</h1>
                    <span className="text-gray-500">{wishlistItems.length} items</span>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
                                <Link to={`/product/${item.product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={
                                            item.product.images?.[0]?.imagePath
                                                ? item.product.images[0].imagePath.startsWith('http')
                                                    ? item.product.images[0].imagePath
                                                    : `${import.meta.env.VITE_API_URL}${item.product.images[0].imagePath}`
                                                : "https://placehold.co/450x600/e2e8f0/1e293b?text=No+Image"
                                        }
                                        alt={item.product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(item.productId);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/product/${item.product.slug}`}>
                                        <h3 className="font-medium text-gray-900 truncate mb-1">{item.product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-500 mb-4">₹{item.product.price.toLocaleString()}</p>

                                    <button
                                        onClick={() => handleAddToCart(item.product)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <ShoppingBag size={16} />
                                        View Product
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Save items you love to revisit later.</p>
                        <Link to="/shop" className="px-8 py-3 bg-black text-white rounded-full">Explore Shop</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
