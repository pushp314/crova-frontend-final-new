import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusUpdateModal = ({
    isOpen,
    onClose,
    onUpdate,
    currentStatus,
    orderNumber
}) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    const statuses = [
        { id: 'PENDING', label: 'Pending', desc: 'Order received, awaiting processing' },
        { id: 'PAID', label: 'Paid', desc: 'Payment verified successfully' },
        { id: 'PROCESSING', label: 'Processing', desc: 'Order is being packed/prepared' },
        { id: 'SHIPPED', label: 'Shipped', desc: 'Handed over to delivery partner' },
        { id: 'DELIVERED', label: 'Delivered', desc: 'Parcel reached the customer' },
        { id: 'CANCELLED', label: 'Cancelled', desc: 'Order terminated/refunded' }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Update Status</h3>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">Order #{orderNumber?.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {statuses.map((status) => (
                            <button
                                key={status.id}
                                onClick={() => setSelectedStatus(status.id)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedStatus === status.id
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                                    }`}
                            >
                                <div>
                                    <p className={`font-bold uppercase tracking-wider text-xs ${selectedStatus === status.id ? 'text-white/70' : 'text-gray-400'}`}>
                                        {status.label}
                                    </p>
                                    <p className={`text-sm mt-1 line-clamp-1 ${selectedStatus === status.id ? 'text-white' : 'text-gray-600'}`}>
                                        {status.desc}
                                    </p>
                                </div>
                                {selectedStatus === status.id && (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-50 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onUpdate(selectedStatus);
                                onClose();
                            }}
                            className="flex-1 py-3.5 text-sm font-bold text-white bg-black rounded-2xl hover:bg-gray-800 shadow-xl shadow-black/10 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StatusUpdateModal;
