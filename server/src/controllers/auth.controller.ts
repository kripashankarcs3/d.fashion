import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import User from "../models/user.model";

// ================= REGISTER =================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("========== REGISTER API ==========");

    const { name, email, password } = req.body;

    console.log("Request Body:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("Checking Email:", normalizedEmail);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    console.log("Existing User:", existingUser);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword =
      await AuthService.hashPassword(password);

    console.log("Password Hashed");

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    console.log("Saved User:", user);

    const totalUsers = await User.countDocuments();

    console.log("Total Users:", totalUsers);

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("REGISTER ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// ================= LOGIN =================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("========== LOGIN API ==========");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    console.log("Login User:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword =
      await AuthService.comparePassword(
        password,
        user.password
      );

    console.log("Password Match:", validPassword);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("LOGIN ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};