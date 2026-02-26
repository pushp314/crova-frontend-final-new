"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import ProductCard from '../product/ProductCard';

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const { data } = await api.get('/products', {
                params: {
                    featured: true,
                    limit: 8
                }
            });
            setProducts(data.data?.products || data.products || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center animate-pulse">
                        <div className="h-12 bg-gray-100 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-100 rounded w-96 mx-auto mb-12"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-4">
                            Featured Picks
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Our most-loved pieces, chosen for their timeless design and exceptional quality.
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="group flex items-center gap-2 text-black font-medium hover:opacity-70 transition-opacity"
                    >
                        Explore All
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
