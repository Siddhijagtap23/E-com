import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      showToast('Please complete all shipping address fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const response = await API.post('/orders', {
        items: orderItems,
        shippingAddress,
      });

      if (response.data.success) {
        showToast('Order placed successfully!', 'success');
        clearCart();
        navigate('/my-orders');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to place order. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Shipping Address Form */}
        <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              <span>Shipping Address</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Enter your physical delivery details for Cash on Delivery</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={shippingAddress.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+1 234 567 8900"
                value={shippingAddress.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Street Address *
              </label>
              <textarea
                name="address"
                required
                rows="2"
                placeholder="123 Main St, Apartment / Suite"
                value={shippingAddress.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="New York"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pincode / Zip *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  placeholder="10001"
                  value={shippingAddress.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900">Cash on Delivery (COD)</h4>
                    <p className="text-xs text-emerald-700">Pay with cash when your package arrives at your doorstep</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                  Selected
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-base shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Place Order (${subtotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="w-full lg:w-96 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <span>Order Recap ({cart.length})</span>
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {cart.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3 text-xs">
                <img
                  src={item.product.image || 'https://via.placeholder.com/60'}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                  <p className="text-gray-500">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                </div>
                <span className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-base">
              <span className="font-bold text-gray-900">Total Payable</span>
              <span className="font-black text-xl text-brand-600">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
