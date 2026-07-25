import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Route
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode._id).select("_id role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    return next();


  } catch (error) {
    console.log("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid Token",
    });
  }
};

// Admin Check
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(req.user._id).select("role");

    if (!user || user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log("Admin Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error in admin middleware",
    });
  }
};