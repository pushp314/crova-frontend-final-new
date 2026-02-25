"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Show modal after 2 seconds for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-[800px] bg-white rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500 ease-out"
        role="dialog"
        aria-modal="true"
      >
        {/* Left Section: Image */}
        <div className="relative w-full md:w-[45%] h-[240px] md:h-auto">
          <img
            src="/assets/collections/womens-collection.jpg"
            alt="Aesthetic woman wearing fashion essentials"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Section: Content */}
        <div className="relative flex-1 p-8 md:p-12 flex flex-col justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-1 text-black/40 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-tight text-black">
                Subscribe to our mailing list &<br />
                Earn 20% off code to your inbox
              </h2>
            </div>

            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
            >
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  required
                  className="w-full h-[54px] pl-6 pr-14 rounded-full border border-black/5 bg-white text-[15px] placeholder:text-black/40 outline-none focus:ring-1 focus:ring-black/10 transition-shadow"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 w-[38px] h-[38px] bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-soft"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            <p className="text-[13px] leading-[1.6] text-black/60 font-normal">
              By joining our email list, you&rsquo;re saying yes to style updates, cozy vibes, and thoughtful emails. We&rsquo;ll always treat your info with care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;