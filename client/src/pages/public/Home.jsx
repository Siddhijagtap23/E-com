import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import api from '../../api/api';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        if (prodRes.data?.data) {
          setFeaturedProducts(prodRes.data.data.slice(0, 4));
        }
        if (catRes.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    const res = addToCart(product, 1);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 px-6 py-16 sm:px-12 sm:py-24 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/30 border border-blue-400/30 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>MERN Mini E-Commerce Demo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Discover Quality Essentials Delivered to Your Door.
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl">
            Browse our curated electronics, fashion apparel, and footwear collections. Pay safely with Cash on Delivery.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3.5 rounded-xl font-semibold text-blue-900 bg-white hover:bg-blue-50 shadow-md transition transform active:scale-95"
            >
              Shop All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explore by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Browse through our specialized product lines</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
            View Catalog <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition block"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition">
                {cat.name[0]}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {cat.description || `Browse quality ${cat.name} products`}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Hand-picked selections with ready inventory</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
            See More <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse space-y-4">
                <div className="w-full h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition flex flex-col group"
              >
                {/* Product Image */}
                <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {product.category?.name || 'Item'}
                  </span>
                </Link>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${product._id}`} className="block">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Price</span>
                      <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1 ${
                        product.stock > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                      {product.stock > 0 ? 'Add' : 'Out'}
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

export default Home;
