import { useAuth } from "../../context/AuthContext";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "../../hooks/queries/useWishlist";
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { motion } from "framer-motion";
import { Minus, Plus, Truck, RotateCcw, CreditCard, Heart, Share2 } from "lucide-react";

const ProductSelector = ({
    product,
    itemVariants,
    availableColors,
    selectedColor,
    setSelectedColor,
    availableSizes,
    selectedSize,
    setSelectedSize,
    quantity,
    handleQuantityChange,
    handleAddToCart,
    isOutOfStock,
    isAdded
}) => {
    const { user } = useAuth();
    const { data: wishlistData } = useWishlist({ enabled: !!user });
    const { mutate: addToWishlist } = useAddToWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();

    const isInWishlist = useMemo(() => {
        if (!wishlistData?.data?.wishlist?.items || !product) return false;
        return wishlistData.data.wishlist.items.some(item => item.productId === product.id);
    }, [wishlistData, product]);

    const handleWishlistClick = () => {
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

    const colorMap = {
        'Pure White': '#FFFFFF',
        'Jet Black': '#000000',
        'Navy Blue': '#000080',
        'Royal Red': '#E31E24',
        'Forest Green': '#228B22',
        'Heather Grey': '#808080',
        'Beige': '#F5F5DC',
        'Default': '#000000'
    };

    return (
        <>
            {/* Selectors */}
            <div className="space-y-8 mb-10">
                {/* Visual Color Selector */}
                {availableColors.length > 0 && availableColors[0] !== 'Default' && (
                    <motion.div variants={itemVariants}>
                        <span className="block text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                            Color: <span className="text-gray-500 font-normal capitalize">{selectedColor}</span>
                        </span>
                        <div className="flex flex-wrap gap-4">
                            {availableColors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                    className={`group relative flex flex-col items-center gap-2 transition-all duration-300`}
                                >
                                    <div 
                                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-sm flex items-center justify-center
                                            ${selectedColor === color 
                                                ? 'border-black ring-4 ring-black/10 scale-110 shadow-lg' 
                                                : 'border-transparent hover:border-gray-300 hover:scale-105'
                                            }`}
                                        style={{ 
                                            backgroundColor: colorMap[color] || '#E5E7EB',
                                            boxShadow: selectedColor === color ? '0 0 0 2px white inset' : 'none'
                                        }}
                                    >
                                        {selectedColor === color && (
                                            <div className={`w-2 h-2 rounded-full ${color === 'Pure White' || color === 'Beige' ? 'bg-black' : 'bg-white'}`} />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-tighter transition-opacity duration-300 ${selectedColor === color ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {color}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Size Selector */}
                {availableSizes.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                Size: <span className="text-gray-500 font-normal">{selectedSize}</span>
                            </span>
                            <button className="text-sm underline text-gray-500 hover:text-black transition-colors">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 rounded-full border text-sm font-bold transition-all duration-300 flex items-center justify-center
                                        ${selectedSize === size
                                            ? "border-black bg-black text-white shadow-lg scale-110"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-black"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-300 rounded-full h-[60px] bg-white px-2">
                            <button
                                onClick={() => handleQuantityChange("minus")}
                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-30"
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange("plus")}
                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <motion.button
                            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                            whileTap={{ scale: isOutOfStock ? 1 : 0.96 }}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`h-[60px] flex-1 rounded-full text-white font-medium text-lg transition-all duration-300 shadow-md flex items-center justify-center gap-3
                                ${isOutOfStock
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isAdded
                                        ? "bg-black hover:bg-black/90"
                                        : "bg-[#1a1a1a] hover:bg-black hover:shadow-xl"
                                }`}
                        >
                            {isOutOfStock ? "Out of Stock" : isAdded ? "Added to Bag" : "Add to Cart"}
                        </motion.button>
                    </div>

                    <div className="flex gap-4">
                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlistClick}
                            className={`h-[60px] w-[60px] flex items-center justify-center rounded-full border transition-all duration-300
                                ${isInWishlist 
                                    ? 'bg-red-50 border-red-200 text-red-500' 
                                    : 'bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <Heart
                                className={`w-6 h-6 transition-all duration-300 ${isInWishlist ? 'fill-current scale-110' : ''}`}
                            />
                        </button>

                        {/* Share Button */}
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: product.name,
                                        text: `Check out ${product.name} on Crova`,
                                        url: window.location.href,
                                    }).catch(console.error);
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard!");
                                }
                            }}
                            className="h-[60px] w-[60px] flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black transition-all duration-300"
                            title="Share Product"
                        >
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>

            {/* Value Props & Security - kept here as they are visual addons below actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Truck className="w-5 h-5 text-gray-800" /></div>
                    <div>
                        <h5 className="font-bold text-sm text-gray-900">Free Shipping</h5>
                        <p className="text-xs text-gray-500 mt-1">On all orders over ₹2000</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><RotateCcw className="w-5 h-5 text-gray-800" /></div>
                    <div>
                        <h5 className="font-bold text-sm text-gray-900">Free Returns</h5>
                        <p className="text-xs text-gray-500 mt-1">Within 14 days</p>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex items-center gap-4 text-gray-400 grayscale opacity-70">
                <CreditCard className="w-6 h-6" />
                <span className="text-xs">Secure checkout with SSL encryption</span>
            </motion.div>
        </>
    );
};

export default ProductSelector;
