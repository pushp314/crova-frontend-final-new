import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const { data } = await api.get('/collections'); // Endpoint for Collections
            if (data.success) {
                setCollections(data.data.collections || []);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center items-center">
                <div className="animate-pulse">Loading collections...</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white pt-[56px] min-h-screen pb-20">

            {/* Header */}
            <div className="w-full py-24 px-6 text-center border-b border-gray-100 bg-white">
                <h1 className="text-[56px] font-serif font-medium text-[#1a1a1a] mb-6 tracking-tight leading-none">
                    Curated Collections
                </h1>
                <p className="max-w-2xl mx-auto text-[#666666] text-[18px] leading-relaxed">
                    Explore our thoughtfully assembled series of products. Each collection tells a unique story through color, texture, and form.
                </p>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-16">
                    {collections.map((col) => {
                        const isThemeHex = col.theme?.startsWith('#');
                        const isTextHex = col.textColor?.startsWith('#');

                        const containerStyle = isThemeHex ? { backgroundColor: col.theme } : {};
                        const containerClass = `group relative overflow-hidden rounded-[32px] transition-transform duration-500 ${!isThemeHex ? col.theme : ''}`;

                        // For text color, if it's hex, we apply it to children or use a wrapper style.
                        // But Tailwind classes like 'text-red-900' are convenient.
                        // If Hex, we might need to apply 'color: hex' to the container so it inherits?
                        const textStyle = isTextHex ? { color: col.textColor } : {};
                        const textClass = !isTextHex ? col.textColor : '';

                        return (
                            <div
                                key={col.id}
                                className={containerClass}
                                style={containerStyle}
                            >
                                <div className="flex flex-col md:flex-row items-center">

                                    {/* Text Content */}
                                    <div className="flex-1 p-12 md:p-20 flex flex-col items-start gap-6">
                                        <div className="mb-2 p-3 bg-white/50 rounded-full backdrop-blur-sm">
                                            <Sparkles className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div className="space-y-4" style={textStyle}>
                                            <span
                                                className={`inline-block px-4 py-1.5 rounded-full bg-white/60 text-sm font-medium ${!isTextHex ? col.textColor : ''}`}
                                                style={isTextHex ? { color: col.textColor } : {}}
                                            >
                                                {col.stats}
                                            </span>
                                            <h2 className={`text-[42px] leading-[1.1] font-medium ${textClass}`}>
                                                {col.title}
                                            </h2>
                                            <p className={`text-lg opacity-80 max-w-md leading-relaxed ${textClass}`}>
                                                {col.description}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/collections/${col.slug}`}
                                            className={`group mt-4 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[15px] font-medium transition-all hover:shadow-lg ${textClass}`}
                                            style={textStyle}
                                        >
                                            Explore Collection
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>

                                    {/* Image */}
                                    <div className="flex-1 relative h-[500px] md:h-[600px] w-full">
                                        <img
                                            src={col.image || "https://framerusercontent.com/images/placeholder.jpg"}
                                            alt={col.title}
                                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </div>

                                {/* Products Preview Grid */}
                                {col.products && col.products.length > 0 && (
                                    <div className="px-12 md:px-20 pb-12">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {col.products.slice(0, 4).map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={`/product/${product.slug}`}
                                                    className="group/item"
                                                >
                                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm mb-3">
                                                        <img
                                                            src={product.images?.[0]?.imagePath.startsWith('http') ? product.images[0].imagePath : `${import.meta.env.VITE_API_URL}${product.images[0]?.imagePath}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                                                        />
                                                    </div>
                                                    <h3
                                                        className={`text-sm font-medium ${textClass} group-hover/item:opacity-70 transition-opacity`}
                                                        style={textStyle}
                                                    >
                                                        {product.name}
                                                    </h3>
                                                    <p
                                                        className={`text-sm opacity-70 mt-1 ${textClass}`}
                                                        style={textStyle}
                                                    >
                                                        ₹{product.price}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Collections;
