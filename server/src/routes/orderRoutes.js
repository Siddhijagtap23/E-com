const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Customer Protected Routes
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);

// Admin Protected Routes
router.get('/admin/orders', authMiddleware, adminMiddleware, getAllOrders);
router.patch('/admin/orders/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
