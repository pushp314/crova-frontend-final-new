import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import api from '../../api/client';

const AdminCollectionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        image: '',
        theme: '#ffffff', // Default hex
        textColor: '#000000',
    });

    // Product handling
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [addProductId, setAddProductId] = useState('');

    useEffect(() => {
        fetchProducts();
        if (isEdit) {
            fetchCollection();
        }
    }, [id]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products', { params: { includeInactive: true, limit: 100 } });
            setProducts(data.data?.products || data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCollection = async () => {
        try {
            // Need an endpoint that gets by ID, but we usually have getBySlug. 
            // Ideally backend should support getById for admin.
            // Using getBySlug requires us to know the slug, but we have ID.
            // Let's assume we fetch all and find, or use the public slug one if we can get slug from list.
            // BETTER: Add getById endpoint or loop through list. 
            // For now, I'll fetch list and find by ID.
            const { data } = await api.get('/collections');
            const collections = data.data?.collections || [];
            const found = collections.find(c => c.id === id);

            if (found) {
                if (found.products) {
                    setSelectedProducts(found.products.map(p => p.id));
                }

                // Formatting theme/text color if they were classes before
                let themeColor = found.theme;
                if (themeColor.startsWith('bg-')) themeColor = '#ffffff'; // Fallback for legacy classes

                let txtColor = found.textColor;
                if (txtColor && txtColor.startsWith('text-')) txtColor = '#000000';

                setFormData({
                    title: found.title,
                    slug: found.slug,
                    description: found.description || '',
                    image: found.image || '',
                    theme: themeColor,
                    textColor: txtColor,
                });
            }
        } catch (error) {
            console.error('Error fetching collection:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-slug
            slug: name === 'title' && !isEdit ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { ...formData, products: selectedProducts };
            // Ensure theme/textColor are hex
            if (!payload.theme.startsWith('#') && !payload.theme.startsWith('bg-')) {
                payload.theme = `#${payload.theme}`; // unlikely if input type=color
            }

            if (isEdit) {
                await api.put(`/collections/${id}`, payload);
            } else {
                await api.post('/collections', payload);
            }
            navigate('/admin/collections');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save collection');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/collections')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEdit ? 'Edit Collection' : 'New Collection'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        />
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg mt-2" />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Background Color (Dynamic)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="theme"
                                    value={formData.theme.startsWith('#') ? formData.theme : '#ffffff'}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded border border-gray-200 p-1 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleChange}
                                    placeholder="#ffffff"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Select a color to make the background dynamic.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Text Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="textColor"
                                    value={formData.textColor.startsWith('#') ? formData.textColor : '#000000'}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded border border-gray-200 p-1 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="textColor"
                                    value={formData.textColor}
                                    onChange={handleChange}
                                    placeholder="#000000"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">Select Products</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                            {products.map(product => (
                                <label key={product.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedProducts.includes(product.id)
                                    ? 'border-black bg-white shadow-sm ring-1 ring-black'
                                    : 'border-transparent hover:bg-gray-100'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => {
                                            setSelectedProducts(prev =>
                                                prev.includes(product.id)
                                                    ? prev.filter(id => id !== product.id)
                                                    : [...prev, product.id]
                                            );
                                        }}
                                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                    />
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {product.images?.[0] && (
                                            <img
                                                src={product.images[0].imagePath.startsWith('http') ? product.images[0].imagePath : `${import.meta.env.VITE_API_URL}${product.images[0].imagePath}`}
                                                alt=""
                                                className="w-8 h-8 rounded object-cover bg-gray-200"
                                            />
                                        )}
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/collections')}
                        className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Collection'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCollectionForm;
