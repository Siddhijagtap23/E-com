import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
      {/* Value Proposition Strip */}
      <div className="border-b border-gray-800 bg-gray-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Truck className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Cash on Delivery</h4>
                <p className="text-xs text-gray-400">Pay safely when your package arrives at your doorstep</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Guaranteed Quality</h4>
                <p className="text-xs text-gray-400">100% authentic curated catalog items</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <RotateCcw className="w-8 h-8 text-indigo-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Fast Dispatch</h4>
                <p className="text-xs text-gray-400">Orders confirmed & processed swiftly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-blue-500" />
          <span>&copy; 2026 MiniShop. MERN Stack Mini E-Commerce Demo.</span>
        </div>
        <div className="flex items-center space-x-1 mt-3 sm:mt-0">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using React, Tailwind CSS, Express & MongoDB</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
