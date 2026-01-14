import React from "react";
import { motion } from "framer-motion";
import { Truck, RotateCcw, CreditCard } from "lucide-react";

const ProductInfo = ({ product, itemVariants }) => {
    return (
        <>
            {/* Header */}
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                <span className="text-gray-500 text-sm font-medium tracking-wide">
                    {product.category?.name || "Collection"} • SKU: {product.id.toString().padStart(4, '0')}
                </span>
                <div className="flex items-center gap-1 text-black text-sm">
                    {'★'.repeat(Math.round(product.rating || 0))}
                    {'☆'.repeat(5 - Math.round(product.rating || 0))}
                    <span className="text-gray-400 ml-1 font-normal">
                        ({product.rating?.toFixed(1) || 0} • {product.numReviews || 0} Reviews)
                    </span>
                </div>
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight font-display mb-6 leading-[1.1]"
            >
                {product.name}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl font-medium text-gray-900">
                    ₹{product.price.toLocaleString()}
                </span>
            </motion.div>

            <motion.p variants={itemVariants} className="text-gray-600 leading-relaxed text-lg mb-10 max-w-xl">
                {product.description || "Experience the perfect blend of style and comfort. Crafted with precision for the modern individual, this piece is a versatile addition to any wardrobe."}
            </motion.p>

            <motion.div variants={itemVariants} className="h-px bg-gray-200 w-full mb-10" />

            {/* Value Props */}
            {/* Note: I'm keeping Value Props here as they are part of the static info, but they could be separate too */}
        </>
    );
};

export default ProductInfo;
