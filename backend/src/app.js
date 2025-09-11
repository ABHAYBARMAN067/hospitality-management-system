import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/bookings", bookingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Restaurant Table Booking API is running...");
});

// Error Handling
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
app.use(notFound);
app.use(errorHandler);

export default app;
