import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Tag, ChevronRight } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { CardSkeleton } from '../components/Skeleton';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories'),
        ]);
        setProducts(prodRes.data.data.slice(0, 8)); // Display top 8 latest products
        setCategories(catRes.data.data);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MERN Mini E-Commerce Store</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Discover Premium Products at <span className="text-brand-400">Unbeatable Prices</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Shop the latest electronics, fashion, and shoes with real-time stock tracking and fast Cash on Delivery checkout.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-600/30 transition-all hover:translate-y-[-2px]"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Chips Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-600" />
            <span>Shop by Category</span>
          </h2>
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:text-brand-600 text-sm font-semibold text-gray-700 shadow-xs whitespace-nowrap transition-all"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:text-brand-600 text-sm font-semibold text-gray-700 shadow-xs whitespace-nowrap transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500">Handpicked items ready for immediate delivery</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>See full catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-700">No products available yet</h3>
            <p className="text-sm text-gray-500">Check back soon or add items via the Admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-gray-700 shadow-xs border border-gray-200/50">
                      {product.category?.name || 'Item'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link
                      to={`/products/${product._id}`}
                      className="font-semibold text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors text-sm"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Price</span>
                      <span className="text-lg font-black text-gray-900">${product.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock <= 0}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        product.stock > 0
                          ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.stock > 0 ? 'Add' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
