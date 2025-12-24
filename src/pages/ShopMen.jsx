import React, { useState, useEffect } from "react";
import { ChevronDown, CreditCard, RotateCcw, Globe } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/product/ProductCard";

const features = [
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Secure Checkout",
        desc: "Your info stays safe with us. All payments are encrypted and protected.",
        color: "bg-green-100 text-green-700"
    },
    {
        icon: <RotateCcw className="w-6 h-6" />,
        title: "Free Returns",
        desc: "Changed your mind? No worries. Return within 14 days, hassle-free.",
        color: "bg-blue-100 text-blue-700"
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Global Shipping",
        desc: "We ship worldwide. Wherever you are, we'll find you.",
        color: "bg-purple-100 text-purple-700"
    }
];

const ShopMen = () => {
    const { subCategory } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("Shop All");

    const filters = ["Shop All", "Shirts", "Trousers", "Outerwear", "Couple"];

    useEffect(() => {
        fetchProducts();
    }, [subCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Fetch men's products from API
            const { data } = await api.get('/products', {
                params: {
                    category: 'men'
                }
            });
            setProducts(data?.data?.products || data?.products || []);

            // Set active filter based on URL param
            if (subCategory) {
                // Map URL friendly slug back to Display Name if needed, or just use capitalizing
                // For simplicity, if subCategory is 'outerwear', set 'Outerwear'
                const match = filters.find(f => f.toLowerCase() === subCategory.toLowerCase());
                if (match) setActiveFilter(match);
            }
        } catch (error) {
            console.error('Error fetching men products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on active filter
    const filteredProducts = products.filter(product => {
        if (activeFilter === "Shop All") return true;

        const name = product.name.toLowerCase();
        const desc = product.description?.toLowerCase() || '';
        const slug = product.slug.toLowerCase();

        if (activeFilter === "Shirts") {
            return name.includes('shirt') || name.includes('polo') || slug.includes('shirt');
        }
        if (activeFilter === "Trousers") {
            return name.includes('trouser') || name.includes('chino') || name.includes('jeans') || name.includes('pant') || slug.includes('pant');
        }
        if (activeFilter === "Outerwear" || activeFilter === "Outwear") { // Handle both just in case
            return name.includes('jacket') || name.includes('coat') || name.includes('hoodie') || name.includes('sweater') || name.includes('bomber') || slug.includes('outerwear');
        }
        if (activeFilter === "Couple") {
            return name.includes('couple') || name.includes('matching') || name.includes('set') || name.includes('unisex') || product.category?.name?.toLowerCase() === 'couple';
        }

        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-32 px-4 flex justify-center">
                <div className="w-full max-w-[1400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white pt-[56px]">

            {/* Hero Section */}
            <div className="relative w-full h-[400px] bg-gradient-to-br from-[#e8f0f8] to-[#f1f6fa] flex items-center overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 z-10">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-[64px] font-serif font-medium text-[#2d2d2d] leading-none tracking-tight">
                            Men
                        </h1>
                        <p className="text-[16px] text-[#5a5a5a] max-w-md leading-relaxed">
                            Refined essentials for the modern gentleman. Crafted with care, designed to last.
                        </p>
                    </div>

                    <div className="absolute right-0 bottom-0 top-0 md:relative md:h-full flex items-end justify-end opacity-40 md:opacity-100 pointer-events-none">
                        <img
                            src="/images/men-fashion.png"
                            alt="Men's Fashion"
                            className="h-full object-contain object-bottom mix-blend-multiply"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="w-full flex justify-center py-12 border-b border-gray-100">
                <div className="flex items-center gap-8">
                    {filters.map((filter) => (
                        <Link
                            key={filter}
                            to={filter === "Shop All" ? "/category/men" : `/category/men/${filter}`}
                            onClick={() => setActiveFilter(filter)}
                            className={`text-[15px] font-medium pb-2 transition-all duration-300 relative
                                ${activeFilter === filter ? "text-black" : "text-gray-400 hover:text-gray-600"}
                            `}
                        >
                            {filter}
                            {activeFilter === filter && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-[1400px] mx-auto px-6 py-20">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="w-full bg-[#fafafa] py-20">
                <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-4">
                            <div className={`p-4 rounded-2xl ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h4 className="text-[16px] font-semibold text-black">{feature.title}</h4>
                            <p className="text-[14px] text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopMen;
