import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Load recent searches
            const saved = localStorage.getItem('recentSearches');
            if (saved) setRecentSearches(JSON.parse(saved));

            // Fetch trending
            fetchTrending();
        }
    }, [isOpen]);

    const fetchTrending = async () => {
        try {
            const { data } = await api.get('/products/featured?limit=4');
            setTrendingProducts(data.data?.products || []);
        } catch (error) {
            console.error('Failed to fetch trending:', error);
        }
    };

    const addToHistory = (term) => {
        if (!term.trim()) return;
        const newHistory = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
        setRecentSearches(newHistory);
        localStorage.setItem('recentSearches', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    useEffect(() => {
        if (query.trim()) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
            setResults(data.data?.products || data.products || []);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addToHistory(query);
            // Optionally redirect to full search page here
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 m-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 text-lg outline-none placeholder-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-gray-500 text-sm">Searching...</p>
                        </div>
                    ) : query ? (
                        results.length > 0 ? (
                            <div className="space-y-4">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.slug}`}
                                        onClick={() => {
                                            addToHistory(query);
                                            onClose();
                                        }}
                                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-all group"
                                    >
                                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0].imagePath.startsWith('http')
                                                        ? product.images[0].imagePath
                                                        : `${import.meta.env.VITE_API_URL}${product.images[0].imagePath}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 group-hover:text-black group-hover:underline decoration-1 underline-offset-4">{product.name}</h4>
                                            <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No results found for "{query}"</p>
                            </div>
                        )
                    ) : (
                        <div className="space-y-8">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3 px-2">
                                        <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
                                        <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-red-500 transition-colors">Clear</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setQuery(term)}
                                                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm rounded-full transition-colors"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trending Products */}
                            {trendingProducts.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">Trending Now</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {trendingProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.slug}`}
                                                onClick={onClose}
                                                className="group flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {product.images?.[0] && (
                                                        <img
                                                            src={product.images[0].imagePath.startsWith('http')
                                                                ? product.images[0].imagePath
                                                                : `${import.meta.env.VITE_API_URL}${product.images[0].imagePath}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:underline decoration-1 underline-offset-2">{product.name}</h4>
                                                    <p className="text-xs text-gray-500">₹{product.price.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
