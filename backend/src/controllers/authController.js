import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Signup
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role, profileImage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    let uploadedImageUrl = "";
    if (profileImage) {
      // Upload image to Cloudinary
      const uploaded = await cloudinary.uploader.upload(profileImage, {
        folder: "restaurant_users",
      });
      uploadedImageUrl = uploaded.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      profileImage: uploadedImageUrl,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(" New user created:", user.email);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
