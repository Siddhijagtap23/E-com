import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Plus, Minus, ShieldCheck, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { DetailSkeleton } from '../components/Skeleton';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-gray-100 text-center space-y-4 shadow-xs">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">{error || 'The requested product does not exist.'}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to results</span>
      </button>

      {/* Main Product Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={product.image || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-xs font-bold text-gray-700 shadow-xs border border-gray-200">
              {product.category?.name || 'Category'}
            </span>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Stock Badge */}
            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                  Hurry! Only {product.stock} left in stock
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>

            <div className="text-3xl font-black text-brand-600">
              ${product.price.toFixed(2)}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-600 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2 text-gray-600 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  Max: {product.stock}
                </span>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                !isOutOfStock
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isOutOfStock ? 'Currently Out of Stock' : `Add ${quantity} to Cart`}</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-500 font-medium">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Authentic Product</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-brand-600" />
              <span>7-Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
