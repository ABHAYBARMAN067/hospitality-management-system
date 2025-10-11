import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret', // fallback secret for testing
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
