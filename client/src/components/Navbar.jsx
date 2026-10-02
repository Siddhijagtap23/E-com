import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShieldAlert, Menu, X, PackageCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black group-hover:bg-brand-700 transition-colors shadow-sm">
              M
            </div>
            <span>Mini<span className="text-brand-600">Shop</span></span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-brand-600 transition-colors">
              Catalog
            </Link>

            {user && (
              <Link to="/my-orders" className="hover:text-brand-600 transition-colors flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4" />
                My Orders
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-gray-900 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-brand-600"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Catalog
          </Link>

          {user && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              My Orders
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-sm text-gray-800">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
