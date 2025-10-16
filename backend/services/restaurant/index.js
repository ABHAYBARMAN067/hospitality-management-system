import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../../config/database.js';
import restaurantRoutes from './restaurants.js';
import menuRoutes from './menu.js';
import reviewRoutes from './reviews.js';

dotenv.config();

const app = express();
const PORT = process.env.RESTAURANT_PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'restaurant', status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});

export default app;
