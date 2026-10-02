import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import api from '../../api/api';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.data) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    if (!product) return;
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const res = addToCart(product, quantity);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border border-gray-200">
          <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Catalog
      </Link>

      {/* Product Details Grid */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                {product.category?.name || 'Item'}
              </span>
              {product.stock > 10 && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                  In Stock ({product.stock} available)
                </span>
              )}
              {product.stock > 0 && product.stock <= 10 && (
                <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-100">
                  Low Stock (Only {product.stock} left!)
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full border border-rose-100">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-gray-900">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-4">
              {product.description}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Toggle */}
                <div className="flex items-center justify-between border border-gray-200 rounded-xl p-1 bg-gray-50 w-full sm:w-36">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-gray-900 text-base">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition transform active:scale-95 space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium text-center">
                This item is currently out of stock. Check back soon!
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs text-gray-500 border-t border-gray-100">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
