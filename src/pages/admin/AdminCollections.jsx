import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/collections');
            setCollections(data.data?.collections || data.collections || []);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            await api.delete(`/admin/collections/${id}`); // Correct route
            setCollections(collections.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting collection:', error);
            // Fallback for public/admin route confusion if needed, but endpoint expects admin route
            try {
                await api.delete(`/collections/${id}`);
                setCollections(collections.filter(c => c.id !== id));
            } catch (retryError) {
                toast.error('Failed to delete collection');
            }
        }
    };

    const filteredCollections = collections.filter(col =>
        col.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
                    <p className="text-gray-500 mt-1">Manage your curated collections</p>
                </div>
                <Link
                    to="/admin/collections/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Collection
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading collections...</p>
                    </div>
                ) : filteredCollections.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No collections found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Collection
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Theme
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCollections.map((col) => (
                                    <tr key={col.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {col.image ? (
                                                        <img
                                                            src={col.image}
                                                            alt={col.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{col.title}</p>
                                                    <p className="text-sm text-gray-500">/{col.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: col.theme.startsWith('#') ? col.theme : undefined }}
                                                    title={col.theme}
                                                >
                                                    {/* If it's a class, show text? Or rely on inline style fix later */}
                                                    {!col.theme.startsWith('#') && (
                                                        <div className={`w-full h-full rounded-full ${col.theme}`}></div>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-600">{col.theme}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {col.stats}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/collections/${col.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <Link
                                                    to={`/admin/collections/${col.id}/edit`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(col.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCollections;
