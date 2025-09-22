import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// Enhanced authentication middleware with detailed error handling
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided."
      });
    }

    // Verify token and check expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({
        status: "error",
        message: "Token has expired. Please login again."
      });
    }

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User no longer exists."
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: "error",
        message: "Account is disabled. Please contact support."
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: "error",
        message: "Invalid token format."
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: "error",
        message: "Token has expired. Please login again."
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Authentication failed. Please try again."
    });
  }
};

// Admin role verification middleware
export const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required."
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin privileges required."
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error while verifying admin privileges."
    });
  }
};

// Rate limiting for failed login attempts
let loginAttempts = new Map();

export const checkLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  const currentTime = Date.now();
  const attemptWindow = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (loginAttempts.has(ip)) {
    const attempts = loginAttempts.get(ip);

    // Clear old attempts
    const recentAttempts = attempts.filter(timestamp =>
      currentTime - timestamp < attemptWindow
    );

    if (recentAttempts.length >= maxAttempts) {
      return res.status(429).json({
        status: "error",
        message: "Too many login attempts. Please try again in 15 minutes.",
        waitTime: Math.ceil((attemptWindow - (currentTime - recentAttempts[0])) / 1000 / 60)
      });
    }

    loginAttempts.set(ip, [...recentAttempts, currentTime]);
  } else {
    loginAttempts.set(ip, [currentTime]);
  }

  next();
};
