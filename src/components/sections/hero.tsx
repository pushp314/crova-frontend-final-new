"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const BannerContent = () => (
    <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
      <div className="max-w-[800px] space-y-6 md:space-y-8">
        <div className="space-y-4">
          <h1
            className="text-[#000000] font-semibold leading-[1.1] tracking-[-0.02em] text-[40px] md:text-[64px]"
            style={{
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Effortless Style,
            <br />
            Thoughtfully Made
          </h1>

          <p
            className="text-[#000000] text-base md:text-[18px] leading-[1.6] max-w-[600px] mx-auto opacity-80"
            style={{
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Modern essentials in soft tones and timeless cuts — designed to feel good and look even better.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Shop Women Button */}
          <Link
            to="/category/women"
            className="group flex items-center justify-center gap-2 bg-[#000000] text-[#FFFFFF] px-8 py-4 rounded-[8px] transition-all duration-300 hover:bg-[#333333] min-w-[180px]"
          >
            <span className="text-[16px] font-medium">Shop Women</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Shop Men Button */}
          <Link
            to="/category/men"
            className="group flex items-center justify-center gap-2 bg-[#FFFFFF] border border-[#000000] text-[#000000] px-8 py-4 rounded-[8px] transition-all duration-300 hover:bg-[#F5F5F5] min-w-[180px]"
          >
            <span className="text-[16px] font-medium">Shop Men</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  const heroContent = (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[90vh] md:h-[900px] bg-[#F5F5F5]"
      style={{
        padding: '0px',
      }}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          <video
            src="https://framerusercontent.com/assets/NjTmL2YIzs2LWaHT2O5VsxgAQ.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>
      </div>

      <BannerContent />

      {/* Scroll Down Animation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 opacity-60 pointer-events-none">
        <div className="flex flex-col items-center animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#000000] -mb-3" strokeWidth={1.5} />
          <ChevronDown className="w-6 h-6 text-[#000000]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Responsive adjustments */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 809px) {
          .framer-vishyy {
            height: auto;
            min-height: 100vh;
            padding: 80px 20px;
          }
        }
      `}} />
    </section>
  );

  return heroContent;
};

export default HeroSection;