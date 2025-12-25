import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Upload } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

const AdminProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        stock: '',
        isActive: true,
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [discount, setDiscount] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchCollections();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchCollections = async () => {
        try {
            const { data } = await api.get('/collections');
            if (data.success) {
                setCollections(data.data?.collections || data.collections || []);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            if (data.success) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);
            if (data.success) {
                const product = data.data.product;
                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    comparePrice: product.comparePrice || '',
                    category: product.categoryId, // Assuming backend returns categoryId or category object
                    stock: product.variants?.[0]?.stock || 0, // Simplified: assuming 1 variant for now or flattening
                    isActive: product.isActive,
                });

                // Set existing images
                if (product.images) {
                    setPreviewImages(product.images.map(img => img.imagePath));
                }

                // Set collections
                if (product.collections) {
                    setSelectedCollections(product.collections.map(c => c.id));
                }

                // Calculate discount
                if (product.comparePrice && product.price) {
                    const d = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
                    setDiscount(d);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to fetch product details');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Discount Logic
        if (name === 'comparePrice' || name === 'price') {
            const newPrice = name === 'price' ? parseFloat(value) : parseFloat(formData.price);
            const newComparePrice = name === 'comparePrice' ? parseFloat(value) : parseFloat(formData.comparePrice);

            if (newPrice && newComparePrice && newComparePrice > newPrice) {
                const d = Math.round(((newComparePrice - newPrice) / newComparePrice) * 100);
                setDiscount(d);
            } else {
                setDiscount('');
            }
        }
    };

    const handleDiscountChange = (e) => {
        const val = e.target.value;
        setDiscount(val);

        if (val && formData.comparePrice) {
            const originalPrice = parseFloat(formData.comparePrice);
            const discountPercent = parseFloat(val);
            const newPrice = Math.round(originalPrice * (1 - discountPercent / 100));
            setFormData(prev => ({ ...prev, price: newPrice }));
        }
    };

    const toggleCollection = (collectionId) => {
        setSelectedCollections(prev =>
            prev.includes(collectionId)
                ? prev.filter(id => id !== collectionId)
                : [...prev, collectionId]
        );
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('comparePrice', formData.comparePrice);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('isActive', formData.isActive);

            selectedCollections.forEach(id => {
                data.append('collections[]', id);
            });

            images.forEach(image => {
                data.append('images', image);
            });

            if (isEditMode) {
                await api.put(`/products/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div className="p-12 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                required
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price (₹)</label>
                            <input
                                type="number"
                                name="comparePrice"
                                value={formData.comparePrice}
                                onChange={handleChange}
                                min="0"
                                placeholder="Optional"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <p className="text-xs text-gray-500 mt-1">Set higher than price to show discount</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={handleDiscountChange}
                                min="0"
                                max="99"
                                placeholder="e.g. 50"
                                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                            />
                            <p className="text-xs text-blue-600 mt-1">Auto-updates selling price</p>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                required
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                            <input
                                required
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <p className="text-xs text-gray-500 mt-1">Stock for base variant</p>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <span className="font-medium text-gray-700">Active (Visible in store)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Collections */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold">Collections</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {collections.map(collection => (
                            <label key={collection.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCollections.includes(collection.id)
                                    ? 'border-black bg-gray-50 ring-1 ring-black'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={selectedCollections.includes(collection.id)}
                                    onChange={() => toggleCollection(collection.id)}
                                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <span className="text-sm font-medium text-gray-700">{collection.title}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold">Images</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previewImages.map((src, index) => (
                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Upload Image</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
