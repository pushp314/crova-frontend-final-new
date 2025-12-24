"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const PastelDreamsCollection: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastelProducts();
  }, []);

  const fetchPastelProducts = async () => {
    try {
      const { data } = await api.get('/products', {
        params: {
          category: 'collections',
          featured: true
        }
      });

      // Filter for pastel-related products
      const pastelProducts = (data.products || []).filter((p: any) =>
        p.name.toLowerCase().includes('pastel') ||
        p.slug.includes('pastel')
      ).slice(0, 4);

      setProducts(pastelProducts);
    } catch (error) {
      console.error('Error fetching pastel products:', error);
      // Fallback to empty if error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-[#F5F5F5] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section
      id="collection-1"
      className="bg-[#F5F5F5] section-padding"
      style={{ paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2
            className="text-black font-medium tracking-tight mb-3"
            style={{ fontSize: '48px', lineHeight: '1.2' }}
          >
            Pastel Dreams
          </h2>
          <p
            className="text-[#666666] font-normal"
            style={{ fontSize: '16px', lineHeight: '1.6' }}
          >
            Soft hues, bold styles — embrace the pastel aesthetic.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product: any) => (
            <Link key={product.id} to={`/product/${product.slug}`} className="group cursor-pointer">
              {/* Image Wrapper */}
              <div
                className="relative overflow-hidden bg-[#FAFAFA] mb-4 rounded-2xl"
                style={{ aspectRatio: '3 / 4' }}
              >
                <img
                  src={product.images?.[0]?.imagePath || "https://framerusercontent.com/images/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Sale Badge */}
                {product.comparePrice && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Sale
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1.5">
                <h3
                  className="text-black font-medium group-hover:opacity-70 transition-opacity"
                  style={{ fontSize: '16px', lineHeight: '1.4' }}
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-2.5">
                  <span
                    className="text-black font-semibold"
                    style={{ fontSize: '15px' }}
                  >
                    ₹{product.price}
                  </span>
                  {product.comparePrice && (
                    <span
                      className="text-[#999999] line-through"
                      style={{ fontSize: '14px' }}
                    >
                      ₹{product.comparePrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <Link
            to="/collections/pastel-dreams"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-[15px] font-medium rounded-full transition-all hover:opacity-90 hover:shadow-lg group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PastelDreamsCollection;