import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            if (data.success) {
                setCategories(data.data.categories || data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (selectedCategory !== "All") {
                params.category = selectedCategory;
            }

            const { data } = await api.get('/products', { params });
            const productsList = data?.data?.products || data?.products || [];
            setProducts(Array.isArray(productsList) ? productsList : []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen pt-32 px-4 flex justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col justify-center items-center">
                <div className="text-red-600 mb-4">⚠️ {error}</div>
                <button
                    onClick={() => fetchProducts()}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-4 md:px-12 pb-20">
            <h1 className="text-4xl font-display mb-8 text-center">Shop</h1>

            {/* Category Filter */}
            <div className="flex justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                            ${selectedCategory === "All"
                                ? "bg-black text-white shadow-lg"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                                ${selectedCategory === category.name
                                    ? "bg-black text-white shadow-lg"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No products found</p>
                    {selectedCategory !== "All" && (
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className="mt-4 text-black underline"
                        >
                            View all products
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
