import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = ({ text, link, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black text-white overflow-hidden relative z-[101]"
                >
                    <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center justify-center text-xs md:text-sm font-medium tracking-wide text-center">
                        <p className="flex items-center gap-2">
                            {text}
                            {link && (
                                <Link
                                    to={link.startsWith('http') ? '#' : link}
                                    onClick={(e) => {
                                        if (link.startsWith('http')) {
                                            e.preventDefault();
                                            window.location.href = link;
                                        }
                                    }}
                                    className="underline underline-offset-4 hover:no-underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
                                >
                                    Shop Now <ArrowRight size={12} />
                                </Link>
                            )}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TopBar;
