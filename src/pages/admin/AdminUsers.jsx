import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, Mail, Calendar } from 'lucide-react';
import api from '../../api/client';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [page, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users', {
                params: {
                    page,
                    limit,
                    search: searchTerm
                }
            });
            setUsers(data.users);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            alert(error.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-500 mt-1">Manage customer accounts and permissions</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset to first page on search
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-1 focus:ring-black ${user.role === 'ADMIN'
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.isEmailVerified
                                                ? 'bg-white text-black border-black'
                                                : 'bg-white text-gray-500 border-gray-200'
                                                }`}>
                                                {user.isEmailVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
