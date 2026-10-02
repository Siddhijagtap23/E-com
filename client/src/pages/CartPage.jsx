import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Looks like you haven't added any products to your cart yet. Explore our catalog and find something you love!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const { product, quantity } = item;
            const isAtMax = quantity >= product.stock;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1 w-full text-center sm:text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {product.category?.name || 'Category'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    <Link to={`/products/${product._id}`} className="hover:text-brand-600">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="text-sm font-black text-brand-600">
                    ${product.price.toFixed(2)}
                  </div>

                  {isAtMax && (
                    <p className="text-[11px] font-medium text-amber-600 flex items-center justify-center sm:justify-start gap-1 pt-1">
                      <AlertCircle className="w-3 h-3" /> Max stock level reached ({product.stock} units)
                    </p>
                  )}
                </div>

                {/* Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="p-1.5 text-gray-600 hover:text-brand-600 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-gray-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      disabled={isAtMax}
                      className="p-1.5 text-gray-600 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title={isAtMax ? `Max stock reached (${product.stock})` : 'Increase quantity'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-[10px] text-gray-400 block font-medium">Total</span>
                    <span className="font-extrabold text-sm text-gray-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">Free (COD)</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-base">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-black text-xl text-brand-600">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
