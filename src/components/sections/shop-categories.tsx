"use client";

import React from 'react';

/**
 * ShopCategories Section
 * 
 * Features a category selection grid with four distinct pastel-colored cards:
 * - Outwear (Seafoam Green)
 * - Tops (Pink)
 * - Bottoms (Mint Blue)
 * - Accessories (Yellow)
 * 
 * Design follows the Crova brand art direction:
 * - Minimalist, airy, and contemporary aesthetic.
 * - Soft pastel color palette.
 * - Large 16px (M) border radius for cards.
 * - Centered typography with clear hierarchy.
 */

const categories = [
  {
    title: 'Outwear',
    subtitle: 'Light, flowy, easy',
    action: 'Shop Now',
    bgColor: 'bg-[#DCFCE7]', // Seafoam
    textColor: 'text-black',
  },
  {
    title: 'Tops',
    subtitle: 'Cute meets comfy',
    action: 'Shop Now',
    bgColor: 'bg-[#FBCFE8]', // Pink
    textColor: 'text-black',
  },
  {
    title: 'Bottoms',
    subtitle: 'Relaxed fits, always',
    action: 'Shop Now',
    bgColor: 'bg-[#D1FAFF]', // Mint
    textColor: 'text-black',
  },
  {
    title: 'Couple',
    subtitle: 'Matching vibes',
    action: 'Shop Now',
    bgColor: 'bg-[#FEF9C3]', // Yellow
    textColor: 'text-black',
  },
];

export default function ShopCategories() {
  return (
    <section className="w-full bg-[#F5F5F5] py-[120px] px-6 md:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Content */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-[32px] md:text-[48px] font-medium leading-[1.2] tracking-tight text-black mb-3">
            Shop Categories
          </h2>
          <p className="text-[#666666] text-base md:text-lg font-normal">
            View and find what you want.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href={`/category/${category.title.toLowerCase()}`}
              className={`group flex flex-col items-center justify-center text-center p-10 md:p-12 ${category.bgColor} rounded-[16px] transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-[1.02] cursor-pointer min-h-[180px] md:min-h-[220px]`}
            >
              <h3 className="text-[20px] md:text-[24px] font-semibold text-black mb-1">
                {category.title}
              </h3>
              <p className="text-black/70 text-[14px] md:text-[15px] font-normal mb-6">
                {category.subtitle}
              </p>

              {/* Animated Action Text with Wavy Motif Underline concept */}
              <div className="relative overflow-hidden">
                <span className="text-[14px] font-semibold text-black inline-block relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-black after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                  {category.action}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}