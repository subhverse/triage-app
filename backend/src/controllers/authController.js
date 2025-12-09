// backend/src/controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const msgs = error.details.map(d => d.message);
      return res.status(400).json({ message: "Validation error", details: msgs });
    }

    const { name, email, password } = value;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const msgs = error.details.map(d => d.message);
      return res.status(400).json({ message: "Validation error", details: msgs });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set httpOnly cookie (dev settings)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful" });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: err.message });
  }
};
