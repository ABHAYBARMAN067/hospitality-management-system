// server.js
import mongoose from "mongoose";
import app from "./app.js";
import cloudinary from "./config/cloudinary.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" MongoDB Connected Successfully");

    // Cloudinary ping test (only here, once)
    try {
      await cloudinary.api.ping();
      console.log("Cloudinary Connected Successfully");
    } catch (err) {
      console.error(" Cloudinary Connection failed:", err.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });
