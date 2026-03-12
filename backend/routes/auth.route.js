import express from "express";
import { forgotPassword, onboard, resetPassword, signin, signout, signup, verifyOTP } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router= express.Router();

router.post("/signup",signup)

router.post("/signin",signin)

router.post("/signout",signout)
// onboarding endpoint it will require authentication so we are going to make a middleware to protect or verify the user is authenticated or not
//we have to protect this onboarding endpoint 

router.post("/onboarding",protectRoute,onboard)

// otp verification

router.post("/verify-otp",verifyOTP);


//checks if the user is authenticated or logged in or not
router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true , user:req.user})
})


router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);




// here we can add more endpopints like forgot password 
//and resetpassword with email id


export default router; 