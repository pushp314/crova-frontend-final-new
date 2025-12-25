import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Package,
    AlertCircle,
    DollarSign,
    MessageSquare,
    Calendar
} from 'lucide-react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(30);

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get(`/admin/analytics?period=${period}`)
            ]);
            setStats(statsRes.data.stats);
            setAnalytics(analyticsRes.data.analytics);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600',
        },
        {
            label: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            label: 'Pending Inquiries',
            value: stats?.pendingInquiries || 0,
            icon: MessageSquare,
            color: 'bg-indigo-100 text-indigo-600',
            link: '/admin/inquiries'
        },
        {
            label: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: Package,
            color: 'bg-orange-100 text-orange-600',
            urgent: true
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your store's performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setPeriod(d)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${period === d
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Last {d} Days
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
                            {stat.link && (
                                <Link to={stat.link} className="absolute inset-0 z-10" />
                            )}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                {stat.urgent && stat.value > 0 && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                        Action Needed
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Low Stock Alert */}
            {stats?.lowStockCount > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900">
                            {stats.lowStockCount} product{stats.lowStockCount > 1 ? 's' : ''} running low on stock
                        </p>
                    </div>
                    <Link
                        to="/admin/products?filter=lowStock"
                        className="text-sm font-bold text-orange-700 hover:underline"
                    >
                        View Inventory →
                    </Link>
                </div>
            )}

            {/* Charts Row 1: Sales Trends & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                        Sales Trend
                    </h2>
                    <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.dailyRevenue || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#000000"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Pie */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
                    <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics?.ordersByStatus || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {analytics?.ordersByStatus?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Payment Methods & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.paymentSplit || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="method" type="category" width={100} stroke="#4B5563" fontSize={12} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#4B5563" radius={[0, 4, 4, 0]} barSize={20} name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
                        <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-700">
                            Manage Inventory →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {analytics?.topProducts?.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.images?.[0] && (
                                            <img
                                                src={item.product.images[0].imagePath}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.color} / {item.size}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{item.totalSold} sold</p>
                                    <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-2 ml-auto">
                                        <div
                                            className="bg-black h-1.5 rounded-full"
                                            style={{ width: `${Math.min((item.totalSold / (analytics.topProducts[0]?.totalSold || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
