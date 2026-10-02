import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer order routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

export default router;

// Dedicated Admin Orders Router
export const adminOrderRouter = express.Router();
adminOrderRouter.get('/', protect, admin, getAllOrdersAdmin);
adminOrderRouter.patch('/:id/status', protect, admin, updateOrderStatusAdmin);
