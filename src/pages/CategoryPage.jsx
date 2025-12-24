import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Link, useParams } from 'react-router-dom';

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        fetchProductsByCategory();
    }, [categorySlug]);

    const fetchProductsByCategory = async () => {
        setLoading(true);
        try {
            // Fetch all products and filter by category slug logic
            // Ideally backend supports /products?category=slug
            const { data } = await api.get(`/products?category=${categorySlug}`);
            setProducts(data?.data?.products || data?.products || []);

            // Capitalize slug for display title
            setCategoryName(categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));
        } catch (error) {
            console.error('Error fetching category products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 px-4 flex justify-center">
                <div className="animate-pulse">Loading {categorySlug}...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-4 md:px-12 pb-20">
            <div className="flex flex-col items-center mb-16">
                <span className="text-sm font-medium tracking-widest text-secondary uppercase mb-4">Collection</span>
                <h1 className="text-5xl font-display text-center">{categoryName}</h1>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-secondary">No products found in this collection yet.</p>
                    <Link to="/shop" className="mt-8 inline-block px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <Link to={`/product/${product.slug}`} key={product.id} className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0].imagePath.startsWith('http')
                                            ? product.images[0].imagePath
                                            : `${import.meta.env.VITE_API_URL}${product.images[0].imagePath}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                                {product.isFeatured && (
                                    <span className="absolute top-4 left-4 bg-black/80 text-white text-xs px-2 py-1 uppercase tracking-wide">Featured</span>
                                )}
                            </div>
                            <h3 className="text-lg font-medium">{product.name}</h3>
                            <p className="text-secondary mt-1">₹{product.price}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
