import React, { useState, useEffect } from 'react';
import { Search, PenTool, Mail, Phone, Calendar, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

const AdminDesignInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [adminReply, setAdminReply] = useState('');

    useEffect(() => {
        fetchInquiries();
    }, []);

    // ... existing fetchInquiries ...

    const handleSendReply = async (id) => {
        try {
            const { data } = await api.put(`/design/${id}/reply`, { reply: adminReply });
            const updatedInquiry = data.data.inquiry;

            setInquiries(inquiries.map(inq =>
                inq.id === id ? updatedInquiry : inq
            ));
            setSelectedInquiry(updatedInquiry);
            setAdminReply('');
            toast.success('Reply sent successfully');
        } catch (error) {
            console.error('Reply error:', error);
            toast.error('Failed to send reply');
        }
    };

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/design');
            setInquiries(data.data.inquiries || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            // Fallback for now if endpoint isn't ready
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/design/${id}/status`, { status: newStatus });
            setInquiries(inquiries.map(inq =>
                inq.id === id ? { ...inq, status: newStatus } : inq
            ));
            toast.success(`Marked as ${newStatus}`);
            if (selectedInquiry?.id === id) {
                setSelectedInquiry({ ...selectedInquiry, status: newStatus });
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONTACTED: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    const filteredInquiries = inquiries.filter(inq =>
        inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Design Inquiries</h1>

            {/* List and Detail Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">

                {/* List Column */}
                <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : filteredInquiries.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No inquiries found</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredInquiries.map((inq) => (
                                    <div
                                        key={inq.id}
                                        onClick={() => setSelectedInquiry(inq)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedInquiry?.id === inq.id ? 'bg-gray-50 border-l-4 border-black' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-medium text-gray-900">{inq.name}</h3>
                                            <StatusBadge status={inq.status} />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2 truncate">{inq.email}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Column */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                    {selectedInquiry ? (
                        <div className="flex-1 overflow-y-auto p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedInquiry.name}</h2>
                                    <div className="flex flex-col gap-1 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> {selectedInquiry.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> {selectedInquiry.phone}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <StatusBadge status={selectedInquiry.status} />
                                    <select
                                        className="text-sm border border-gray-200 rounded-lg p-2 bg-gray-50"
                                        value={selectedInquiry.status}
                                        onChange={(e) => handleStatusUpdate(selectedInquiry.id, e.target.value)}
                                    >
                                        <option value="PENDING">Mark as Pending</option>
                                        <option value="CONTACTED">Mark as Contacted</option>
                                        <option value="COMPLETED">Mark as Completed</option>
                                        <option value="REJECTED">Mark as Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Vision / Notes</h3>
                                <div className="p-6 bg-gray-50 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
                                    {selectedInquiry.description}
                                </div>
                            </div>

                            {/* Images */}
                            {selectedInquiry.images && selectedInquiry.images.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" /> Attachments ({selectedInquiry.images.length})
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedInquiry.images.map((img, idx) => (
                                            <div key={idx} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${img}`}
                                                    alt="Design reference"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}${img}`, '_blank')}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reply Section */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Admin Reply
                                </h3>

                                {selectedInquiry.adminReply ? (
                                    <div className="p-6 bg-blue-50 rounded-xl text-blue-900 border border-blue-100">
                                        <p className="whitespace-pre-wrap">{selectedInquiry.adminReply}</p>
                                        <div className="mt-3 text-xs text-blue-500 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Replied on {new Date(selectedInquiry.adminReplyAt).toLocaleString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <textarea
                                            value={adminReply}
                                            onChange={(e) => setAdminReply(e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black min-h-[120px] resize-none"
                                        />
                                        <button
                                            onClick={() => handleSendReply(selectedInquiry.id)}
                                            disabled={!adminReply.trim()}
                                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Send Reply
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <PenTool className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select an inquiry to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDesignInquiries;
