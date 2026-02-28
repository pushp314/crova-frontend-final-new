"use client";

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-black pt-[120px] pb-10 text-white">
      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Main Footer Card */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] lg:rounded-[40px] px-8 lg:px-16 pt-16 lg:pt-24 pb-8 overflow-hidden relative flex flex-col items-center">

          {/* Top Section: Newsletter and Links */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">

            {/* Newsletter Column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <h2 className="text-[20px] lg:text-[24px] font-semibold leading-tight text-white max-w-[320px]">
                Subscribe to our mailing list & Earn 20% off code to your inbox
              </h2>

              <div className="relative max-w-[400px]">
                <div className="flex items-center bg-white rounded-full p-1.5 shadow-sm">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="flex-1 px-4 py-2 outline-none text-[14px] text-black bg-transparent placeholder:text-[#999999]"
                  />
                  <button className="bg-white text-black p-2.5 rounded-full hover:opacity-80 transition-soft">
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <p className="text-[12px] leading-relaxed text-white max-w-[320px] opacity-80">
                By joining our email list, you&rsquo;re saying yes to style updates, cozy vibes, and thoughtful emails. We&rsquo;ll always treat your info with care.
              </p>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Products */}
              <div className="flex flex-col space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white opacity-60">Products</h4>
                <ul className="flex flex-col space-y-2 text-[14px]">
                  <li><Link to="/category/women" className="hover:opacity-60 transition-soft">Women</Link></li>
                  <li><Link to="/category/men" className="hover:opacity-60 transition-soft">Men</Link></li>
                  <li><Link to="/collections" className="hover:opacity-60 transition-soft">Collections</Link></li>
                  <li><Link to="/custom-design" className="hover:opacity-60 transition-soft text-white font-medium">Customize T-Shirt</Link></li>
                  <li><Link to="/shop" className="hover:opacity-60 transition-soft">Shop All</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white opacity-60">Company</h4>
                <ul className="flex flex-col space-y-2 text-[14px]">
                  <li><Link to="/about" className="hover:opacity-60 transition-soft">About us</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                </ul>
              </div>

              {/* Find Us On */}
              <div className="flex flex-col space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white opacity-60">Find Us On</h4>
                <ul className="flex flex-col space-y-2 text-[14px]">
                  <li><a href="https://www.instagram.com/crova.in" className="hover:opacity-60 transition-soft">Instagram</a></li>
                  <li><a href="https://twitter.com/crovafashion" className="hover:opacity-60 transition-soft">Twitter/x.com</a></li>
                  <li><a href="#" className="hover:opacity-60 transition-soft">Threads</a></li>
                  <li><a href="#" className="hover:opacity-60 transition-soft">Etsy</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white opacity-60">Legal</h4>
                <ul className="flex flex-col space-y-2 text-[14px]">
                  <li><Link to="/terms" className="hover:opacity-60 transition-soft">Terms & Conditions</Link></li>
                  <li><Link to="/contact" className="hover:opacity-60 transition-soft">Shipping & Returns</Link></li>
                  <li><Link to="/privacy-policy" className="hover:opacity-60 transition-soft">Privacy Policy</Link></li>
                  <li><a href="#" className="hover:opacity-60 transition-soft">404</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Massive Watermark Section */}
          <div className="relative w-full flex items-center justify-center pt-8 lg:pt-16 pointer-events-none select-none">
            <h1 className="text-[120px] md:text-[240px] lg:text-[420px] font-bold leading-none text-white/10 tracking-tighter transition-all duration-700">
              Crova
            </h1>
          </div>

          {/* Wavy Line Decorator */}
          <div className="w-full absolute bottom-[40px] left-0 overflow-hidden pointer-events-none opacity-20">
            <svg
              viewBox="0 0 1440 100"
              className="w-[200%] lg:w-full h-[40px] lg:h-[60px]"
              preserveAspectRatio="none"
              style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.05))' }}
            >
              <path
                d="M0,50 C120,0 240,0 360,50 C480,100 600,100 720,50 C840,0 960,0 1080,50 C1200,100 1320,100 1440,50"
                fill="transparent"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Bar (Outside Main Box) */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-[13px] text-white/60 font-medium px-2">
          <div className="mb-4 md:mb-0">
            © Crova, 2025
          </div>
          <div className="flex space-x-8">
            <span className="cursor-default">All Right Reserved</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .wavy-line-animate {
          animation: wave 10s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;