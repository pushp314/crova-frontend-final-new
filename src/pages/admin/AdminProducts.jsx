import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, AlertTriangle, X } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter === 'featured') params.featured = true;
            if (filter === 'inactive') params.isActive = false;

            // Always include inactive products for admin management
            params.includeInactive = true;

            const { data } = await api.get('/products', { params });
            // Handle nested response structure { data: { products: [] } } vs { products: [] }
            setProducts(data.data?.products || data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product catalog</p>
                </div>
                <Link
                    to="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {['all', 'featured', 'inactive'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No products found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProducts.map((product) => {
                                    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
                                    const lowStock = totalStock < 10;

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                        {product.images?.[0] && (
                                                            <img
                                                                src={product.images[0].imagePath.startsWith('http')
                                                                    ? product.images[0].imagePath
                                                                    : `${import.meta.env.VITE_API_URL}${product.images[0].imagePath}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-500">{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {product.category?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">₹{product.price}</p>
                                                    {product.comparePrice && (
                                                        <p className="text-sm text-gray-500 line-through">₹{product.comparePrice}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {totalStock}
                                                    </span>
                                                    {lowStock && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${product.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <Link
                                                        to={`/admin/products/${product.id}/edit`}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {products.filter(p => p.isActive).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Low Stock Items</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {products.filter(p => {
                            const stock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
                            return stock < 10;
                        }).length}
                    </p>
                </div>
            </div>
        </div>
    );
};

{/* Product Detail Modal */ }
{
    selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <button
                        onClick={() => setSelectedProduct(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                            {selectedProduct.images?.[0] ? (
                                <img
                                    src={selectedProduct.images[0].imagePath.startsWith('http')
                                        ? selectedProduct.images[0].imagePath
                                        : `${import.meta.env.VITE_API_URL}${selectedProduct.images[0].imagePath}`}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {selectedProduct.images?.slice(1).map((img, idx) => (
                                <div key={idx} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    <img
                                        src={img.imagePath.startsWith('http')
                                            ? img.imagePath
                                            : `${import.meta.env.VITE_API_URL}${img.imagePath}`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${selectedProduct.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {selectedProduct.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{selectedProduct.slug}</p>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900">₹{selectedProduct.price}</span>
                            {selectedProduct.comparePrice && (
                                <span className="text-lg text-gray-400 line-through">₹{selectedProduct.comparePrice}</span>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <h3 className="font-medium text-gray-900">Inventory Status</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Total Stock</p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedProduct.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Variants</p>
                                    <p className="font-semibold text-gray-900">{selectedProduct.variants?.length || 0}</p>
                                </div>
                            </div>
                            {selectedProduct.variants?.length > 0 && (
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">Variant Breakdown</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProduct.variants.map((v, i) => (
                                            <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                                                {v.color} / {v.size}: {v.stock}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                            <div className="prose prose-sm text-gray-600 max-h-40 overflow-y-auto">
                                {selectedProduct.description}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex gap-3">
                            <Link
                                to={`/admin/products/${selectedProduct.id}/edit`}
                                className="flex-1 px-4 py-2 bg-black text-white text-center font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Edit Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            );
};

            export default AdminProducts;
