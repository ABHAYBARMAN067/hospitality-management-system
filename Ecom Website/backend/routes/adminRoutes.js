import express from 'express';
import {
  getDashboardOverview,
  getSalesAnalytics,
  getUserAnalytics
} from '../controllers/adminController.js';
import { createProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { adminDataFilter, getAdminData } from '../middlewares/adminAuth.js';
import { uploadProductImages } from '../config/multer.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));
router.use(getAdminData);

// Dashboard routes
router.get('/dashboard', adminDataFilter, getDashboardOverview);

// Analytics routes
router.get('/analytics/sales', adminDataFilter, getSalesAnalytics);
router.get('/analytics/users', adminDataFilter, getUserAnalytics);

// Product management routes
router.post('/products', uploadProductImages.array('images', 5), createProduct);

export default router;
