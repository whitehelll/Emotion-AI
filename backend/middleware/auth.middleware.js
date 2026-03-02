import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => { 

    try {

        // Support cookie + header token
        const token =
            req.cookies?.jwt ||
            req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message:"Unauthorized - No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User
        .findById(decoded.userID)
        .select("-password");

        if(!user){
            return res.status(401).json({
                message:"Unauthorized - User not Found"
            });
        }   

        req.user = user;

        next();  

    } catch (error) {

        console.log(
          "Error in ProtectRoute middleware",
          error.message
        );

        res.status(500).json({
          message: "Internal Server Error"
        });

    }

}