const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private/Customer
 *
 * Security & Integrity:
 * - Prices are strictly queried from MongoDB (never trusted from client)
 * - Validates stock sufficiency for every item
 * - Atomically decrements product stock
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    // 1. Validate shipping address fields
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all shipping address fields: name, phone, address, city, pincode'
      });
    }

    // 2. Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided in cart'
      });
    }

    // 3. Process items, verify stock, calculate authoritative prices
    const orderProducts = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = item.productId || item.product || item._id;
      const requestedQty = Number(item.quantity) || 1;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product reference in items array'
        });
      }

      if (requestedQty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1 unit'
        });
      }

      // Authoritative product lookup from MongoDB
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found`
        });
      }

      // Check stock
      if (product.stock < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${requestedQty}`
        });
      }

      // Compute item total using true database price
      const itemSubtotal = product.price * requestedQty;
      calculatedTotal += itemSubtotal;

      orderProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: requestedQty
      });
    }

    // 4. Create Order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount: Math.round(calculatedTotal * 100) / 100,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    // 5. Decrement stock atomically for each product
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in customer's order history
 * @route   GET /api/orders/my-orders
 * @access  Private/Customer
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'image name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders across all customers
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'image name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order fulfillment status
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
