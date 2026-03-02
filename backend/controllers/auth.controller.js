import User from "../models/User.js";
import jwt from "jsonwebtoken";


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

    // Create user
    const newUser = await User.create({
      name,
      email,
      password
    });


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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost"
    });


    res.status(200).json({
      success: true,
      user
    });

    console.log(req.body)

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