import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
    const { cartCount } = useCart();
    const { user } = useAuth();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Shop', path: '/shop' },
        { icon: Heart, label: 'Wishlist', path: user ? '/profile' : '/auth' }, // Redirect to profile for wishlist or wishlist page if exists
        { icon: ShoppingBag, label: 'Cart', path: '/cart', count: cartCount },
        { icon: User, label: 'Profile', path: user ? '/profile' : '/auth' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 pb-safe z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 w-12
                transition-colors duration-200
                ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}
              `}
                        >
                            <div className="relative">
                                <Icon className="w-6 h-6" strokeWidth={1.5} />
                                {item.count > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
