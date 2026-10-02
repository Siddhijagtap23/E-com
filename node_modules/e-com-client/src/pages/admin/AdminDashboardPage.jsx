import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, ShoppingBag, DollarSign, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import API from '../../api/axios';
import { CardSkeleton } from '../../components/Skeleton';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, ordRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories'),
        API.get('/admin/orders'),
      ]);

      const products = prodRes.data.data || [];
      const categories = catRes.data.data || [];
      const orders = ordRes.data.data || [];

      const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.totalAmount : sum), 0);
      const lowStock = products.filter((p) => p.stock <= 5);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalRevenue,
        lowStockProducts: lowStock,
        recentOrders: orders.slice(0, 5),
      });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-500' },
    { label: 'Categories', value: stats.totalCategories, icon: Tag, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard Overview</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time metrics, store analytics, and inventory alerts</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="p-2 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded-xl transition-colors"
          title="Refresh dashboard data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-black text-gray-900">{card.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Warning Box */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Low Stock Alerts ({stats.lowStockProducts.length})</span>
            </h2>
            <Link to="/admin/products" className="text-xs font-bold text-brand-600 hover:underline">
              Manage
            </Link>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">All product inventory levels are healthy!</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {stats.lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-gray-900 truncate">{prod.name}</h4>
                    <span className="text-[10px] text-gray-500">{prod.category?.name || 'Item'}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shrink-0 ${prod.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`}>
                    {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span>Recent Orders</span>
            </h2>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No customer orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-gray-800">#{ord._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">{ord.user?.name || 'Customer'}</td>
                      <td className="py-3 px-3 font-black text-gray-900">${ord.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
