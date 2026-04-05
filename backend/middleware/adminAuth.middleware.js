import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // 🔥 debug first

    const token =
      req.cookies?.admin_jwt ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found"
      });
    }

    console.log("TOKEN:", token);
    console.log("DECODED:", decoded);

    req.admin = admin;
    next();

  } catch (err) {
    console.log("ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};