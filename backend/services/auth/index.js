import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../../config/database.js';
import authRoutes from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth', status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

export default app;
