import { sendOTP } from "../lib/sendOTP.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


import crypto from "crypto";
import nodemailer from "nodemailer";





// forgot password  


export const forgotPassword = async (req,res)=>{

  const {email} = req.body;

  try{

    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = resetToken;

    user.passwordResetExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL =
      `http://localhost:3000/reset-password/${resetToken}`;

    const transporter =
      nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.EMAIL,
          pass:process.env.EMAIL_PASSWORD
        }
      });

    await transporter.sendMail({

      from:process.env.EMAIL,
      to:user.email,
      subject:"Reset Password",

      html:`
      <h2>Password Reset</h2>
      <p>Click below to reset password</p>
      <a href="${resetURL}">
      Reset Password
      </a>
      `

    });

    res.json({
      message:"Reset link sent to email"
    });

  }catch(err){

    res.status(500).json({
      message:"Error sending email"
    });

  }

};




// reset password



export const resetPassword = async (req,res)=>{

  const {token} = req.params;
  const {password} = req.body;

  try{

    const user = await User.findOne({

      passwordResetToken:token,
      passwordResetExpires:{$gt:Date.now()}

    });

    if(!user){

      return res.status(400).json({
        message:"Token invalid or expired"
      });

    }

    user.password = password;

    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.json({
      message:"Password reset successful"
    });

  }catch(err){

    res.status(500).json({
      message:"Reset failed"
    });

  }

};




// ======================
// SIGNUP CONTROLLER
// ======================

export async function signup(req, res) {

  try {

    const { name, email, password } = req.body;
    console.log(req.body);
    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }


    // otp verification 
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password,

      emailOTP:otp,
      otpExpires:Date.now()+300000
    });


    await sendOTP(email,otp);

    res.json({
      message: "OTP Sent",
      email
    })


    // Generate JWT token
    const token = jwt.sign(
      { userID: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    // Set JWT Cookie (React Compatible)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,          // local development
      sameSite: "lax",        // allows React requests
      path: "/",              // important
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain:"localhost"

    });


    // Send response
    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {

    console.log("Signup error:", error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

}

// ======================
// OTP  CONTROLLER
// ======================

export const verifyOTP = async (req,res)=>{
  const {email,otp} = req.body;

  try {
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        message: "User not Found"
      });
    }

    if(user.emailOTP!=otp){
      return res.status(400).json({
        message:"Wrong OTP",
      });
    }

    if(user.otpExpires<Date.now()){
      return res.status(400).json({
        message:"otp Expired"
      });
    }

    user.isVerified =true;
    user.emailOTP=null;

    await user.save();

    res.json({
      message:"Verified"
    });

    
  } catch (error) {
    res.status(500).json({
      message:"Verification FAiled"
    });
    
  }
};





// ======================
// SIGNIN CONTROLLER
// ======================
export async function signin(req, res) {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Find user FIRST
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Verify Email First"
      });
    }

    // Check password
    const isPasswordCorrect =
      await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userID: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set Cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      user
    });

  }
  catch (error) {

    console.log("Signin error:", error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

}


// ======================
// SIGNOUT CONTROLLER
// ======================

export async function signout(req, res) {

  res.clearCookie("jwt", {
    path: "/"
  });

  res.status(200).json({
    success: true,
    message: "Logout successful"
  });

}



// ======================
// ONBOARDING CONTROLLER
// ======================

export async function onboard(req, res) {

  try {

    const userId = req.user._id;

    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location
    } = req.body;


    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
          nativeLanguage,
          learningLanguage,
          location,
          isOnboard: true
        },
        { new: true }
      );


    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    res.status(200).json({
      success: true,
      user: updatedUser
    });

  }
  catch (error) {

    console.log("Onboarding error:", error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

}