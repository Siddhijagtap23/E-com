import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, Eye, RefreshCw, MapPin, Phone, User } from 'lucide-react';
import api from '../../api/api';
import Toast from '../../components/Toast';

const statusConfig = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders');
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      setToast({ message: 'Failed to load customer orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        setToast({ message: `Order #${orderId.slice(-6)} updated to ${newStatus}`, type: 'success' });
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to update order status',
        type: 'error'
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track fulfillment and update delivery lifecycle stages</p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-sm transition space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-gray-800">No Orders Yet</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">Customer orders will appear here once placed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Total ($)</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((order) => {
                  const style = statusConfig[order.status] || statusConfig.Pending;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.shippingAddress?.name || order.user?.name || 'Customer'}</p>
                        <p className="text-[11px] text-gray-400">{order.user?.email || order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          disabled={statusUpdatingId === order._id}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1 rounded-full border outline-none cursor-pointer ${style.bg} ${style.text} ${style.border}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <span className="text-xs text-gray-500 font-mono">#{selectedOrder._id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                Close ✕
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
              <div className="space-y-1.5">
                <span className="font-bold text-gray-900 flex items-center">
                  <User className="w-3.5 h-3.5 text-blue-600 mr-1.5" /> Recipient
                </span>
                <p>{selectedOrder.shippingAddress?.name}</p>
                <p className="flex items-center text-gray-500">
                  <Phone className="w-3 h-3 mr-1" /> {selectedOrder.shippingAddress?.phone}
                </p>
                <p className="text-gray-500">Account: {selectedOrder.user?.email || 'Customer'}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-gray-900 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1.5" /> Delivery Address
                </span>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}</p>
                <p className="font-semibold text-emerald-700">Payment: Cash on Delivery</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Products</h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                {selectedOrder.products.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between bg-white text-xs">
                    <div className="flex items-center space-x-3">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status Selector */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400 block">Total Amount</span>
                <span className="text-2xl font-extrabold text-gray-900">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-600">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 bg-white shadow-sm outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
