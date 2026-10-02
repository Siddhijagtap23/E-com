import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
  }
  if (!shippingAddress || !shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
    return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
  }

  const orderProducts = [];
  let totalAmount = 0;

  // Process items sequentially to ensure stock validation & price integrity
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Product '${product.name}' only has ${product.stock} units in stock`
      });
    }

    orderProducts.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });

    totalAmount += product.price * item.quantity;
  }

  // Atomic stock decrement
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }

  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    totalAmount: Number(totalAmount.toFixed(2)),
    shippingAddress,
    paymentMethod: 'Cash on Delivery',
    status: 'Pending'
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order
  });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};

export const getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};

export const updateOrderStatusAdmin = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status value. Allowed: ${validStatuses.join(', ')}` });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  const updatedOrder = await order.save();
  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: updatedOrder
  });
};
