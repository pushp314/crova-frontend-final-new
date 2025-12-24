import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Truck, Ruler, CreditCard, RotateCcw, Heart, Share2 } from "lucide-react";
import api from "../api/client";
import { useProduct } from "../hooks/queries/useProducts";
import { useCart } from "../context/CartContext";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductSelector from "../components/product/ProductSelector";
import ProductReviews from "../components/reviews/ProductReviews";

// --- Mock Data Fallback ---
const getMockProduct = (id) => ({
    id: id || 1,
    name: "Classic Premium Tee",
    price: 49,
    description: "A premium quality essential designed for everyday comfort. Made from 100% organic cotton, this piece features a relaxed fit and durable stitching.",
    images: [{ imagePath: "/images/placeholder.jpg" }],
    variants: [
        { id: 'v1', size: 'S', color: 'Black' },
        { id: 'v2', size: 'M', color: 'Black' },
        { id: 'v3', size: 'L', color: 'Black' },
        { id: 'v4', size: 'S', color: 'White' },
    ],
    category: { name: "Essentials" }
});

// --- Animations ---
const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.1
        }
    },
    exit: { opacity: 0 }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

// --- Skeleton Component ---
const ProductSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="w-full aspect-[4/5] bg-gray-100 rounded-[32px] animate-pulse" />
        <div className="flex flex-col pt-4 space-y-6">
            <div className="w-1/3 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="w-3/4 h-12 bg-gray-100 rounded animate-pulse" />
            <div className="w-1/4 h-8 bg-gray-100 rounded animate-pulse" />
            <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
            <div className="flex gap-4">
                <div className="w-1/3 h-12 bg-gray-100 rounded-full animate-pulse" />
                <div className="w-1/3 h-12 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="w-full h-[56px] bg-gray-100 rounded-full animate-pulse" />
        </div>
    </div>
);

const ProductView = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // React Query
    const { data: productData, isLoading, isError } = useProduct(slug);
    const product = productData?.data?.product || productData?.product || null;

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    // Initialize variants when product loads
    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            // Only set if not already set (to preserve selection if re-fetching? 
            // actually on first load both are empty string)
            if (!selectedSize && !selectedColor) {
                const firstVariant = product.variants[0];
                setSelectedSize(firstVariant.size);
                setSelectedColor(firstVariant.color);
            }
        }
    }, [product]);

    // Handle mocks or errors if needed, but for now we rely on API
    // If we strictly want the mock fallback:
    const displayProduct = product || (isError ? getMockProduct(slug) : null);

    // Override product with displayProduct for rendering
    // But wait, the component uses 'product' variable. 
    // Let's transparently use displayProduct as 'product' for the rest of the file
    // by shadowing or just using a different name. 
    // Let's assume we want real data. If error, we show error state or mock. 

    // Let's stick to real data for performance phase.

    // Effect for scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Derived State
    const availableSizes = product ? [...new Set(product.variants?.map((v) => v.size) || [])] : [];
    const availableColors = product ? [...new Set(product.variants?.map((v) => v.color) || [])] : [];

    const currentVariant = product?.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor
    );
    const isOutOfStock = product && !currentVariant;

    const mainImage = product?.images?.[0]?.imagePath?.startsWith('http')
        ? product.images[0].imagePath
        : product?.images?.[0]?.imagePath
            ? `${import.meta.env.VITE_API_URL}${product.images[0].imagePath}`
            : "https://framerusercontent.com/images/u1w5u5k.jpg";

    const handleQuantityChange = (type) => {
        setQuantity(prev => type === "minus" ? Math.max(1, prev - 1) : prev + 1);
    };

    const handleAddToCart = async () => {
        if (!currentVariant) return;
        try {
            await addToCart(currentVariant.id, quantity);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            console.error("Add to cart error", error);
        }
    };

    if (isLoading) return <ProductSkeleton />;

    if (!product && !isError) return (
        <div className="min-h-screen pt-32 text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <button onClick={() => navigate('/shop')} className="mt-4 text-blue-600 underline">Return to Shop</button>
        </div>
    );


    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product?.name,
        "image": mainImage,
        "description": product?.description,
        "brand": {
            "@type": "Brand",
            "name": "Crova"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": product?.price,
            "availability": !isOutOfStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    return (
        <motion.div
            className="bg-[#fafafa] min-h-screen pt-24 md:pt-[120px] pb-24 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
        >
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Left Column - Image */}
                    <ProductImageGallery product={product} mainImage={mainImage} />

                    {/* Right Column - Info */}
                    <motion.div className="flex flex-col pt-4" variants={itemVariants}>
                        <ProductInfo product={product} itemVariants={itemVariants} />

                        <ProductSelector
                            product={product}
                            itemVariants={itemVariants}
                            availableColors={availableColors}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            availableSizes={availableSizes}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                            quantity={quantity}
                            handleQuantityChange={handleQuantityChange}
                            handleAddToCart={handleAddToCart}
                            isOutOfStock={isOutOfStock}
                            isAdded={isAdded}
                        />

                    </motion.div>
                </div>

                {/* Product Reviews */}
                <motion.div variants={itemVariants}>
                    <ProductReviews productId={product?.id} />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProductView;
