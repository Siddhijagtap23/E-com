import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalAmount, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const handleQtyUpdate = (productId, newQty, stock) => {
    if (newQty > stock) {
      setToastMessage(`Cannot add more. Only ${stock} units available in stock`);
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    const res = updateQuantity(productId, newQty);
    if (!res.success && res.message) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900">Your Cart is Empty</h2>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Looks like you haven't added anything to your cart yet. Explore our catalog to find great essentials!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition"
        >
          Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mt-1">Review your items ({itemCount} {itemCount === 1 ? 'item' : 'items'})</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <Link
                    to={`/products/${product._id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)} each</p>
                  <span className="inline-block text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                  <button
                    onClick={() => handleQtyUpdate(product._id, quantity - 1, product.stock)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQtyUpdate(product._id, quantity + 1, product.stock)}
                    disabled={quantity >= product.stock}
                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right min-w-[5rem]">
                  <span className="text-xs text-gray-400 block sm:hidden">Total</span>
                  <span className="font-extrabold text-gray-900 text-base">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-gray-400 hover:text-rose-600 p-2 transition rounded-lg hover:bg-rose-50"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment Mode</span>
              <span className="font-semibold text-gray-900">Cash on Delivery</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-extrabold text-gray-900">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure Cash on Delivery Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
