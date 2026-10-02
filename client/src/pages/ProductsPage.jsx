import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, AlertCircle } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { CardSkeleton } from '../components/Skeleton';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParam);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategoryParam, searchParam]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategoryParam) params.append('category', activeCategoryParam);
      if (searchParam) params.append('search', searchParam);

      const res = await API.get(`/products?${params.toString()}`);
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName) {
      newParams.set('category', categoryName);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">Browse our full collection of products</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </form>
      </div>

      {/* Category Chips Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Categories</span>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              !activeCategoryParam
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => {
            const isActive = activeCategoryParam === cat.name;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
          <p className="text-sm text-gray-500">
            No items match your filter criteria. Try clearing search filters or selecting another category.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
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
                      {product.category?.name || 'Category'}
                    </span>
                  </div>

                  {/* Stock Pill Badge */}
                  <div className="absolute top-3 right-3">
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                        Only {product.stock} left!
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        In Stock ({product.stock})
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link
                      to={`/products/${product._id}`}
                      className="font-bold text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors text-sm"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Price</span>
                      <span className="text-lg font-black text-gray-900">${product.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        !isOutOfStock
                          ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
