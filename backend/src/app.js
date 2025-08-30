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
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/bookings", bookingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Restaurant Table Booking API is running...");
});

export default app;
