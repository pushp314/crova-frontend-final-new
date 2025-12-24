import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BannerPopup = ({ banner, isOpen, onClose }) => {
    // Only show if there is an image to show
    if (!banner?.image) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative z-10 w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Image */}
                        <div className="relative aspect-[4/5] md:aspect-square w-full">
                            {banner.type === 'VIDEO' ? (
                                <video
                                    src={banner.image.startsWith('http') ? banner.image : `${import.meta.env.VITE_API_URL}${banner.image}`}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={banner.image.startsWith('http') ? banner.image : `${import.meta.env.VITE_API_URL}${banner.image}`}
                                    alt={banner.title || "Promotion"}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Text Overlay (Optional - usually image has text, but if not) */}
                            {banner.title && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                                    <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                                    {banner.subtitle && <p className="text-sm opacity-90">{banner.subtitle}</p>}
                                    {banner.link && (
                                        <button
                                            onClick={() => {
                                                window.location.href = banner.link;
                                                onClose();
                                            }}
                                            className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors"
                                        >
                                            Shop Now
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BannerPopup;
