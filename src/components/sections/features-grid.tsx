"use client";

import React from 'react';
import { CreditCard, RotateCcw, Globe, HelpCircle } from 'lucide-react';

const features = [
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Secure Checkout",
    description: "Your info stays safe with us. All payments are encrypted and protected.",
    bgColor: "bg-[#DCFCE7]", // Seafoam
    iconColor: "text-[#166534]",
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    title: "Easy Returns",
    description: "Changed your mind? No worries — you have 30 days to send it back, stress-free.",
    bgColor: "bg-[#FBCFE8]", // Pink
    iconColor: "text-[#9d174d]",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Worldwide Delivery",
    description: "From our shop to your doorstep. Fast, reliable shipping wherever you are.",
    bgColor: "bg-[#D1FAFF]", // Mint/Light Blue
    iconColor: "text-[#0e7490]",
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: "Here to Help",
    description: "Need something? Our support team's just a message always happy to chat.",
    bgColor: "bg-[#FEF9C3]", // Yellow
    iconColor: "text-[#854d0e]",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="w-full bg-[#F5F5F5] py-[80px] md:py-[120px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start max-w-[280px]">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-lg mb-6 ${feature.bgColor} ${feature.iconColor}`}
              >
                {feature.icon}
              </div>
              <h4 className="text-[16px] font-semibold text-black mb-3 tracking-tight">
                {feature.title}
              </h4>
              <p className="text-[14px] leading-[1.6] text-[#666666] font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;