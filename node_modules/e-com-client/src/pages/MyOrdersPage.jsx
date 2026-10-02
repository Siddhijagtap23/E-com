import React, { useEffect, useState } from 'react';
import { PackageCheck, Clock, MapPin, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../api/axios';
import { TableSkeleton } from '../components/Skeleton';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const response = await API.get('/orders/my-orders');
      setOrders(response.data.data);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-brand-600" />
            <span>My Orders</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Track your order statuses and purchase history</p>
        </div>
        <button
          onClick={fetchMyOrders}
          className="p-2 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded-xl transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-brand-600 mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
          <p className="text-sm text-gray-500">
            You haven't placed any orders yet. Start exploring our catalog to make your first purchase!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden transition-all hover:shadow-md"
            >
              {/* Order Top Bar */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-gray-400 block font-medium">Order Placed</span>
                    <span className="font-bold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Order ID</span>
                    <span className="font-mono font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Payment</span>
                    <span className="font-bold text-gray-800">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Items */}
                <div className="lg:col-span-2 space-y-4">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-gray-500">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-extrabold text-sm text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Grand Total */}
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4 text-xs">
                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span>Shipping Destination</span>
                    </h5>
                    <p className="font-bold text-gray-900">{order.shippingAddress.name}</p>
                    <p className="text-gray-600 leading-snug">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-500 font-mono pt-1">Phone: {order.shippingAddress.phone}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <span className="font-bold text-gray-700 text-xs">Grand Total</span>
                    <span className="font-black text-lg text-brand-600">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
