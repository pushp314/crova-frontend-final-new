"use client";

import React from 'react';

const BrandStory = () => {
  return (
    <section className="bg-white py-[120px] overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content Column */}
          <div className="flex flex-col">
            <div className="max-w-[480px]">
              <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-black leading-[1.2] mb-6">
                A softer take on style.
              </h2>
              <p className="text-[#666666] text-[16px] leading-[1.6] mb-12">
                We&apos;re here for effortless fashion that fits your mood — light, calm, and just a little playful. Minimalist, monochrome, and the kind of pieces you&apos;ll reach for every day.
              </p>
            </div>

            {/* Floating Badges Cluster */}
            <div className="relative h-[240px] w-full max-w-[400px] mt-4">
              {/* Curated Collections - Vertical Pill */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center"
                style={{ zIndex: 10 }}
              >
                <span className="bg-white border border-gray-100 text-black text-[12px] font-semibold px-5 py-2.5 rounded-full whitespace-nowrap shadow-sm">
                  Curated Collections
                </span>
              </div>

              {/* Nationwide Shipping - Mint/Seafoam Pill */}
              <div
                className="absolute left-[40px] top-[10px]"
                style={{ zIndex: 11 }}
              >
                <span className="bg-white border border-gray-100 text-black text-[12px] font-semibold px-5 py-2.5 rounded-full whitespace-nowrap shadow-sm">
                  Nationwide Shipping
                </span>
              </div>

              {/* Quality Assured - Blue Pill */}
              <div
                className="absolute right-[20px] top-[30px]"
                style={{ zIndex: 12 }}
              >
                <span className="bg-white border border-gray-100 text-black text-[12px] font-semibold px-5 py-2.5 rounded-full whitespace-nowrap shadow-sm">
                  Quality Assured
                </span>
              </div>

              {/* Est. 2024 - Pink Pill */}
              <div
                className="absolute right-0 top-[100px]"
                style={{ zIndex: 13 }}
              >
                <span className="bg-white border border-gray-100 text-black text-[12px] font-semibold px-5 py-2.5 rounded-full whitespace-nowrap shadow-sm">
                  Est. 2024
                </span>
              </div>

              {/* Free Shipping - Lavender Pill */}
              <div
                className="absolute left-[110px] bottom-[30px]"
                style={{ zIndex: 14 }}
              >
                <span className="bg-white border border-gray-100 text-black text-[12px] font-semibold px-5 py-2.5 rounded-full whitespace-nowrap shadow-sm">
                  Free Shipping
                </span>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="relative">
            <div className="aspect-[3/4] relative w-full overflow-hidden rounded-[24px]">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
                alt="Effortless fashion style portrait"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;