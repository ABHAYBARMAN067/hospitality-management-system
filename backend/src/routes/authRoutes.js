import express from "express";
import { loginUser, signupUser } from "../controllers/authController.js";

const router = express.Router();

// Signup
router.post("/signup", signupUser);

// Login
router.post("/login", loginUser);

export default router;
