import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft } from 'lucide-react';

const CollectionDetail = () => {
    const { collectionSlug } = useParams();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollection = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/collections/${collectionSlug}`);
                if (data.success) {
                    setCollection(data.data.collection);
                } else {
                    setError('Collection not found');
                }
            } catch (err) {
                console.error('Error fetching collection:', err);
                setError('Failed to load collection');
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [collectionSlug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center items-center">
                <div className="animate-pulse">Loading Collection...</div>
            </div>
        );
    }

    if (error || !collection) {
        return (
            <div className="min-h-screen pt-32 flex flex-col justify-center items-center gap-4">
                <h2 className="text-2xl font-medium text-gray-900">Collection Not Found</h2>
                <Link to="/collections" className="text-black underline">Back to All Collections</Link>
            </div>
        );
    }

    // Determine styles based on theme
    const isThemeHex = collection.theme?.startsWith('#');
    const containerStyle = isThemeHex ? { backgroundColor: collection.theme } : {};
    const containerClass = `w-full min-h-[60vh] relative flex items-center justify-center ${!isThemeHex ? collection.theme : ''}`;

    const isTextHex = collection.textColor?.startsWith('#');
    const textStyle = isTextHex ? { color: collection.textColor } : {};
    const textClass = !isTextHex ? collection.textColor : 'text-gray-900';

    return (
        <div className="w-full bg-white pt-[56px]">
            {/* Hero Section */}
            <div className={containerClass} style={containerStyle}>
                <div className="absolute top-8 left-8 z-10">
                    <Link to="/collections" className={`flex items-center gap-2 text-sm font-medium hover:opacity-70 ${textClass}`} style={textStyle}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <span className={`inline-block mb-4 text-sm font-bold tracking-widest uppercase opacity-60 ${textClass}`} style={textStyle}>
                        Collection
                    </span>
                    <h1 className={`text-[56px] md:text-[80px] font-display font-medium leading-[0.9] mb-6 ${textClass}`} style={textStyle}>
                        {collection.title}
                    </h1>
                    <p className={`text-[18px] md:text-[20px] max-w-2xl mx-auto leading-relaxed opacity-80 ${textClass}`} style={textStyle}>
                        {collection.description}
                    </p>
                </div>

                {/* Background Image if available & desired, or keep it clean with color */}
                {/* <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none">
                     <img src={collection.image} className="w-full h-full object-cover" />
                </div> */}
            </div>

            {/* Products Grid */}
            <div className="max-w-[1400px] mx-auto px-6 py-24">
                {collection.products && collection.products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {collection.products.map((product) => (
                            <Link to={`/product/${product.slug}`} key={product.id} className="group cursor-pointer block">
                                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative rounded-[2px]">
                                    <img
                                        src={product.images?.[0]?.imagePath.startsWith('http')
                                            ? product.images[0].imagePath
                                            : `${import.meta.env.VITE_API_URL}${product.images[0]?.imagePath}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {product.isFeatured && (
                                        <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                                        {product.name}
                                    </h3>
                                    <p className="text-[14px] text-gray-500">
                                        ₹{product.price}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-xl text-gray-500">No products available in this collection yet.</p>
                        <p className="text-gray-400 mt-2">Check back soon for new arrivals.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionDetail;
