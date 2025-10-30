import asyncHandler from "../utils/asyncHandler.js";
import  ApiErrors  from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, _, next) =>{    
        
    try
    {
        
       const token = req.cookies?.accessToken || req.header("Authorization")?.replcace("Bearer ", "")
    
        if (!token)
        {
            throw new ApiErrors("Unauthorized access, token missing", 401);
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const user= await User.findById(decodedToken.id).select("-password -refreshToken")
        {
            if (!user)
            {
                throw new ApiErrors("User not found", 404);
            }
            req.user = user;
            next();
    
        }
    }
    catch (error)
    {
        throw new ApiErrors("Invalid or expired token", 401);
    }    
})