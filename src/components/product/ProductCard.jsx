import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../hooks/queries/useWishlist';
import toast from 'react-hot-toast';

import { getImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { data: wishlistData } = useWishlist({ enabled: !!user });
    const { mutate: addToWishlist } = useAddToWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();

    const isInWishlist = useMemo(() => {
        if (!wishlistData?.data?.wishlist?.items) return false;
        return wishlistData.data.wishlist.items.some(item => item.productId === product.id);
    }, [wishlistData, product.id]);

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent navigation
        if (!user) {
            toast.error("Please login to use wishlist");
            return;
        }

        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({ productId: product.id });
        }
    };

    const imageUrl = product.images?.[0]?.imagePath
        ? getImageUrl(product.images[0].imagePath)
        : "https://placehold.co/450x600/e2e8f0/1e293b?text=No+Image";

    return (
        <Link to={`/product/${product.slug}`} className="group flex flex-col gap-3">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                {product.comparePrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                        Sale
                    </div>
                )}

                <button
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-sm z-10"
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        size={18}
                        className={`transition-colors duration-300 ${isInWishlist ? 'fill-red-500 stroke-red-500' : 'stroke-gray-700 hover:stroke-black'}`}
                    />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-900 group-hover:opacity-70 transition-opacity truncate">
                    {product.name}
                </h3>
                {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                        <span className="text-black text-xs">★</span>
                        <span className="text-xs font-medium text-gray-600">{product.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400">({product.numReviews})</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-black">₹{product.price.toLocaleString()}</span>
                    {product.comparePrice && (
                        <span className="text-[13px] text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
