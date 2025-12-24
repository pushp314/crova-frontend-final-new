"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchModal from "../SearchModal";

const Navigation = () => {
  const { cart } = useCart();
  const { user, logout, openAuthModal } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = React.useRef(null);

  // Menu Data setup
  const menuConfig = {
    Women: {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
      links: [
        { name: "Shop All", href: "/category/women" },
        { name: "Outwear", href: "/category/women/Outwear" },
        { name: "Tops", href: "/category/women/Tops" },
        { name: "Bottoms", href: "/category/women/Bottoms" },
        { name: "Couple", href: "/category/women/Couple" },
      ],
    },
    Men: {
      image: "/images/men-fashion.png",
      links: [
        { name: "Shop All", href: "/category/men" },
        { name: "Outwear", href: "/category/men/Outwear" },
        { name: "Tops", href: "/category/men/Tops" },
        { name: "Bottoms", href: "/category/men/Bottoms" },
        { name: "Couple", href: "/category/men/Couple" },
      ],
    },
    Collections: {
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      links: [
        { name: "All Collections", href: "/collections" },
        { name: "Minimalist Edit", href: "/collections/minimalist-edit" },
        { name: "Signature Series", href: "/collections/signature-series" },
        { name: "Waitlist: Timeless", href: "/collections/timeless-together" },
        { name: "Customize", href: "/custom-design" },
      ],
    },
    Company: {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      links: [
        { name: "About us", href: "/about" },
        { name: "Journal", href: "/journal" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact us", href: "/contact" },
      ],
    },
  };

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300); // 300ms delay for "around it" feel
  };

  const handleClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-[#0000000d] h-[56px] flex items-center transition-all duration-300"
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between relative h-full">

          {/* Left Container: Navigation Links */}
          <div className="flex-1 hidden md:flex items-center gap-8 h-full" onMouseLeave={handleMouseLeave}>
            {Object.keys(menuConfig).map((item) => (
              <div
                key={item}
                className="h-full flex items-center relative group"
                onMouseEnter={() => handleMouseEnter(item)}
              >
                <button
                  onClick={() => handleClick(item)}
                  className={`text-[14px] font-medium text-[#000000] wavy-underline transition-all duration-300 hover:opacity-70 leading-none py-1 tracking-tight cursor-pointer ${activeMenu === item ? 'opacity-70' : ''}`}
                  aria-expanded={activeMenu === item}
                  aria-haspopup="true"
                >
                  {item}
                </button>

                {/* Invisible bridge to connect button and dropdown */}
                {activeMenu === item && (
                  <div className="absolute top-full left-0 w-full h-4 bg-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Mega Menu Dropdown */}
          {/* We render this OUTSIDE the loop but relative to the nav container or managed via state positioning. 
               Since the design has it fixed to the left relative to nav, we'll keep it simple.
           */}
          <div
            className={`absolute top-[56px] left-6 shadow-xl rounded-2xl bg-white border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform origin-top-left
               ${activeMenu ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'}`}
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: '1000px',
              zIndex: 110
            }}
          >
            {activeMenu && menuConfig[activeMenu] && (
              <div className="flex gap-6 p-4">
                {/* Image Section */}
                <div className="w-[180px] h-[220px] overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={menuConfig[activeMenu].image}
                    alt={activeMenu}
                    className="w-full h-full object-cover animate-in fade-in duration-500"
                  />
                </div>

                {/* Links Section */}
                <div className="flex flex-col gap-3 min-w-[150px] pr-8 pt-2">
                  {menuConfig[activeMenu].links.map((link, idx) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-[15px] text-gray-600 hover:text-black hover:translate-x-1 transition-all duration-200 py-1 block w-full"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                      onClick={() => setActiveMenu(null)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Container: Logo */}
          <div className="flex-none flex justify-center items-center absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="transition-opacity duration-300 hover:opacity-70">
              <span className="font-display font-bold text-2xl tracking-tight text-black">Crova</span>
            </Link>
          </div>

          {/* Right Container */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="p-1 hover:opacity-70 transition-opacity">
              <img src="https://framerusercontent.com/images/qdckiVlNxv6r160Akl8DHajkak.svg" alt="Search" className="w-[18px] h-[18px]" />
            </button>

            <Link to="/wishlist" className="p-1 hover:opacity-70 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </Link>

            {user ? (
              <div className="relative group h-full flex items-center">
                <button className="p-1 hover:opacity-70 transition-opacity flex items-center gap-2">
                  <User className="w-[18px] h-[18px]" />
                </button>
                <div className="absolute top-[40px] right-0 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="px-3 py-2.5 bg-gray-50 rounded-xl mb-2">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Profile
                  </Link>

                  <div className="h-px bg-gray-100 my-1" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="Sign In"
              >
                <User className="w-[18px] h-[18px]" />
              </button>
            )}
            <Link to="/cart" className="flex items-center gap-1.5 group wavy-underline py-1 transition-opacity duration-300 hover:opacity-70">
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.2px]" />
              <div className="flex items-center text-[14px] font-medium text-[#000000] tracking-tight">
                <span>Cart</span>
                <span className="ml-1">({cartCount})</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navigation;