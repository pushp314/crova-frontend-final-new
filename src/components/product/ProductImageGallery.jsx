import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const ProductImageGallery = ({ product }) => {
    const images = product?.images?.length > 0
        ? product.images.map(img => getImageUrl(img.imagePath))
        : ["https://framerusercontent.com/images/u1w5u5k.jpg"];

    const [selectedIdx, setSelectedIdx] = useState(0);

    // Update index if product changes
    useEffect(() => {
        setSelectedIdx(0);
    }, [product?.id]);

    const nextImage = () => setSelectedIdx((prev) => (prev + 1) % images.length);
    const prevImage = () => setSelectedIdx((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="flex flex-col md:flex-row-reverse gap-4 lg:gap-6">
            {/* Main Interactive Image */}
            <motion.div
                className="flex-1 bg-white rounded-[32px] overflow-hidden aspect-[4/5] relative shadow-lg group cursor-zoom-in"
                variants={imageVariants}
                key={selectedIdx}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={images[selectedIdx]}
                        src={images[selectedIdx]}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                </AnimatePresence>

                {/* Navigation Arrows (Only if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
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

            {/* Thumbnail List */}
            {images.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] no-scrollbar py-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIdx(idx)}
                            className={`relative min-w-[70px] w-14 lg:w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0
                                ${selectedIdx === idx ? 'border-black ring-2 ring-black ring-offset-2' : 'border-transparent opacity-60 hover:opacity-100'}
                            `}
                        >
                            <img src={img} alt={`${product?.name} ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;
