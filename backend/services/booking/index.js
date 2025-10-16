import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../../config/database.js';
import adminRoutes from './admin.js';
import bookingRoutes from './bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.BOOKING_PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'booking', status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Booking service running on port ${PORT}`);
});

export default app;
