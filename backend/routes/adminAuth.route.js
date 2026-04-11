import express from "express";
import {
  adminSignup,
  adminLogin,
  adminLogout,
  getAdmin,
  getUsers,
  getAnalytics,
  verifyAdminOTP
} from "../controllers/adminAuth.controller.js";
import { protectAdmin } from "../middleware/adminAuth.middleware.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/verify-otp", verifyAdminOTP);
router.post("/logout", adminLogout);


router.get("/me", protectAdmin, getAdmin);
router.get("/users", protectAdmin, getUsers);
router.get("/emotion/analytics", protectAdmin, getAnalytics);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;