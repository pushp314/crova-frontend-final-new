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
            className="text-white font-semibold leading-[1.1] tracking-[-0.02em] text-[40px] md:text-[64px] drop-shadow-lg"
            style={{
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Effortless Style,
            <br />
            Thoughtfully Made
          </h1>

          <p
            className="text-white text-base md:text-[18px] leading-[1.6] max-w-[600px] mx-auto opacity-90 drop-shadow-md"
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
            className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-[8px] transition-all duration-300 hover:bg-gray-100 min-w-[180px] shadow-lg"
          >
            <span className="text-[16px] font-medium">Shop Women</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Shop Men Button */}
          <Link
            to="/category/men"
            className="group flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-[8px] transition-all duration-300 hover:bg-white/10 backdrop-blur-sm min-w-[180px]"
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
      className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[90vh] md:h-[900px] bg-black"
      style={{
        padding: '0px',
      }}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          <video
            src="/assets/hero/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 pointer-events-none" />
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