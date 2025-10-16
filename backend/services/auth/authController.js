import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Register user (admin or regular user)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hash, role: role || 'user' });
    await user.save();

    res.status(201).json({
      message: 'Registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user/admin
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // role from frontend

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    // Optional role check
    if (role && user.role !== role) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate access token (short-lived, 15 minutes)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '15m' }
    );

    // Generate refresh token (long-lived, 7 days)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user (for session persistence)
export const getMe = async (req, res) => {
  try {
    res.json({
      user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    // Find user by refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout (invalidate refresh token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    // Remove refresh token from user
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
