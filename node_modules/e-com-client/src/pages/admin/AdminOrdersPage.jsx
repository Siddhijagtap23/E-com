import React, { useEffect, useState } from 'react';
import { ShoppingBag, Eye, X, Search, RefreshCw, MapPin, User } from 'lucide-react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/Skeleton';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/orders');
      setOrders(response.data.data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await API.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to '${newStatus}'`, 'success');

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status';
      showToast(msg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
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

  const filteredOrders = orders.filter((o) =>
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.user?.email && o.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-600" />
            <span>Order Fulfillment Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Review incoming customer orders and advance shipping statuses</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search orders by ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded-xl"
          title="Refresh orders table"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-4">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
          <p className="text-xs text-gray-500">Customer orders will appear here as soon as they are placed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status Pipeline</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    #{ord._id.slice(-8).toUpperCase()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{ord.user?.name || 'Customer'}</span>
                      <span className="text-[10px] text-gray-400">{ord.user?.email || 'N/A'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-600 font-medium">
                    {new Date(ord.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="py-3.5 px-4 font-black text-gray-900">${ord.totalAmount.toFixed(2)}</td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        disabled={updatingId === ord._id}
                        className={`px-3 py-1 rounded-xl font-bold text-[11px] border cursor-pointer focus:outline-none transition-all ${getStatusBadgeClass(
                          ord.status
                        )}`}
                      >
                        {validStatuses.map((st) => (
                          <option key={st} value={st} className="bg-white text-gray-900 font-normal">
                            {st}
                          </option>
                        ))}
                      </select>
                      {updatingId === ord._id && (
                        <div className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                  <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    #{selectedOrder._id}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                <h4 className="font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>Customer Profile</span>
                </h4>
                <p className="font-bold text-gray-900 text-sm">{selectedOrder.user?.name || 'Customer'}</p>
                <p className="text-gray-600">{selectedOrder.user?.email || 'N/A'}</p>
                <p className="text-gray-500 font-mono">Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                <h4 className="font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>Shipping Address</span>
                </h4>
                <p className="font-bold text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                <p className="text-gray-600 leading-snug">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Order Line Items</h4>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                {selectedOrder.products.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-gray-200/60 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold text-gray-600 border">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">{item.name}</h5>
                        <p className="text-gray-400">Unit Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-gray-600 font-medium">Qty: {item.quantity}</span>
                      <span className="block font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Total */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Update Status</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${getStatusBadgeClass(
                    selectedOrder.status
                  )}`}
                >
                  {validStatuses.map((st) => (
                    <option key={st} value={st} className="bg-white text-gray-900 font-normal">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total Amount Paid / Payable</span>
                <span className="text-2xl font-black text-brand-600">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
