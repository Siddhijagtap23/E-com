import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CategoryList from './CategoryList';
import ProductList from './ProductList';
import OrderList from './OrderList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex-shrink-0 flex flex-col justify-between border-r border-gray-800">
        <div>
          {/* Admin Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <Shield className="w-5 h-5 text-amber-500" />
              <span>Admin<span className="text-blue-500">Panel</span></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'categories'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <Store className="w-4 h-4" />
            <span>Visit Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Dashboard /</span>
            <span className="text-sm font-bold text-gray-800 capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-800 leading-none">{user?.name}</p>
              <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">Admin</span>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="p-6 sm:p-8 flex-1">
          {activeTab === 'categories' && <CategoryList />}
          {activeTab === 'products' && <ProductList />}
          {activeTab === 'orders' && <OrderList />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
