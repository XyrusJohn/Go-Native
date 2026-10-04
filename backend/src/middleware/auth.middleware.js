import jwt from "jsonwebtoken";
import { findDriverById } from "../models/auth.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Token - No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Token - Invalid Token",
      });
    }

    const user = await findDriverById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
