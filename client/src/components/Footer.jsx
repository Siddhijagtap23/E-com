import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Feature Highlights */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Truck className="w-8 h-8 text-brand-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Fast Delivery</h4>
              <p className="text-xs text-slate-400">Cash on Delivery Available</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Quality Guaranteed</h4>
              <p className="text-xs text-slate-400">100% Verified Products</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <RotateCcw className="w-8 h-8 text-brand-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Easy Returns</h4>
              <p className="text-xs text-slate-400">7-Day Return Policy</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Lock className="w-8 h-8 text-brand-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Secure Orders</h4>
              <p className="text-xs text-slate-400">Protected Checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
              M
            </div>
            <span className="font-bold text-lg text-white">Mini<span className="text-brand-500">Shop</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/products" className="hover:text-white transition-colors">Products Catalog</Link>
            <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
          </div>

          <p className="text-xs text-slate-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} MiniShop MERN Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
