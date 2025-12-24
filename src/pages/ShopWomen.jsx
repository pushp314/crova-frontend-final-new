import React, { useState, useEffect } from "react";
import { ChevronDown, CreditCard, RotateCcw, Globe } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../hooks/queries/useProducts";
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

const ShopWomen = () => {
    const { subCategory } = useParams();
    const [activeFilter, setActiveFilter] = useState("Shop All");
    const { data: productsData, isLoading: loading } = useProducts({ category: 'women' });
    const products = productsData?.data?.products || productsData?.products || [];

    const filters = ["Shop All", "Tops", "Bottoms", "Outerwear", "Dresses", "Couple"];

    useEffect(() => {
        if (subCategory) {
            const match = filters.find(f => f.toLowerCase() === subCategory.toLowerCase());
            if (match) setActiveFilter(match);
        }
    }, [subCategory]);

    // Filter products based on active filter
    const filteredProducts = products.filter(product => {
        if (activeFilter === "Shop All") return true;

        const name = product.name.toLowerCase();
        const slug = product.slug.toLowerCase();

        if (activeFilter === "Tops") {
            return name.includes('blouse') || name.includes('shirt') || name.includes('top') || name.includes('t-shirt') || name.includes('camisole');
        }
        if (activeFilter === "Bottoms") {
            return name.includes('skirt') || name.includes('trouser') || name.includes('pant') || name.includes('jeans') || name.includes('shorts');
        }
        if (activeFilter === "Outerwear") {
            return name.includes('jacket') || name.includes('coat') || name.includes('cardigan') || name.includes('blazer');
        }
        if (activeFilter === "Dresses") {
            return name.includes('dress') || name.includes('gown');
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
            <div className="relative w-full h-[400px] bg-gradient-to-br from-[#f8f0e8] to-[#faf6f1] flex items-center overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 z-10">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-[64px] font-serif font-medium text-[#2d2d2d] leading-none tracking-tight">
                            Women
                        </h1>
                        <p className="text-[16px] text-[#5a5a5a] max-w-md leading-relaxed">
                            Timeless pieces designed for the modern woman. Elegant, effortless, essential.
                        </p>
                    </div>

                    <div className="absolute right-0 bottom-0 top-0 md:relative md:h-full flex items-end justify-end opacity-40 md:opacity-100 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                            alt="Women's Fashion"
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
                            to={filter === "Shop All" ? "/category/women" : `/category/women/${filter}`}
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

export default ShopWomen;
