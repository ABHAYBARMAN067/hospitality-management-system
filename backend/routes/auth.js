import express from 'express';
import { register, login, getMe, refreshToken, logout } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe); // Get current user session
router.post('/refresh', refreshToken); // Refresh access token
router.post('/logout', logout); // Logout

export default router;
