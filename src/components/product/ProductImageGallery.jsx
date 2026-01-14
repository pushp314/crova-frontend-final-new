import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const ProductImageGallery = ({ product, mainImage }) => {
    return (
        <motion.div
            className="w-full bg-white rounded-[32px] overflow-hidden aspect-[4/5] relative shadow-lg group cursor-zoom-in"
            variants={imageVariants}
        >
            <motion.img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 reveal-color"
                whileHover={{ scale: 1.05 }}
            />
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    New Arrival
                </span>
            </div>

            {/* Interactive Buttons on Image */}
            <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="p-3 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-colors">
                    <Heart className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

export default ProductImageGallery;
