import React from 'react';
import { Shirt, ShoppingBag, Layers, Heart } from 'lucide-react';

const categories = [
  {
    title: 'Outwear',
    subtitle: 'Light, flowy, easy',
    action: 'Shop Now',
    bgColor: 'bg-stone-50',
    icon: <Shirt className="w-10 h-10" strokeWidth={1.5} />,
  },
  {
    title: 'Tops',
    subtitle: 'Cute meets comfy',
    action: 'Shop Now',
    bgColor: 'bg-stone-50',
    icon: <ShoppingBag className="w-10 h-10" strokeWidth={1.5} />,
  },
  {
    title: 'Bottoms',
    subtitle: 'Relaxed fits, always',
    action: 'Shop Now',
    bgColor: 'bg-stone-50',
    icon: <Layers className="w-10 h-10" strokeWidth={1.5} />,
  },
  {
    title: 'Couple',
    subtitle: 'Matching vibes',
    action: 'Shop Now',
    bgColor: 'bg-stone-50',
    icon: <Heart className="w-10 h-10" strokeWidth={1.5} />,
  },
];

export default function ShopCategories() {
  return (
    <section className="w-full bg-white py-[120px] px-6 md:px-12 lg:px-24">
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
              className={`group flex flex-col items-center justify-center text-center p-10 md:p-12 ${category.bgColor} rounded-[24px] border border-gray-100 transition-all duration-300 ease-in-out hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:scale-[1.02] cursor-pointer min-h-[220px] md:min-h-[260px]`}
            >
              <div className="mb-6 text-black group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-[20px] md:text-[22px] font-semibold text-black mb-1">
                {category.title}
              </h3>
              <p className="text-gray-500 text-[14px] font-normal mb-6">
                {category.subtitle}
              </p>

              <div className="relative overflow-hidden">
                <span className="text-[14px] font-semibold text-black inline-block relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-black after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
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