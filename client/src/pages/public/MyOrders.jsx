import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight, MapPin } from 'lucide-react';
import api from '../../api/api';

const statusConfig = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle },
  Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: Truck },
  Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track your recent orders and delivery status</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Orders Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Explore our catalog and place your first Cash on Delivery order!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm shadow-sm hover:bg-blue-700 transition"
          >
            Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusStyle = statusConfig[order.status] || statusConfig.Pending;
            const StatusIcon = statusStyle.icon;

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Order ID: <span className="text-gray-700 font-mono font-medium">#{order._id}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5 mr-1" />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 space-y-4">
                  <div className="divide-y divide-gray-100">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Destination Footer */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900">{order.shippingAddress?.name}:</strong>{' '}
                        {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode} (Tel: {order.shippingAddress?.phone})
                      </span>
                    </div>

                    <div className="text-right sm:flex-shrink-0">
                      <span className="text-gray-500">Payment: <strong className="text-gray-900">{order.paymentMethod}</strong></span>
                      <div className="text-base font-extrabold text-gray-900 mt-0.5">
                        Total: ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
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

export default MyOrders;
