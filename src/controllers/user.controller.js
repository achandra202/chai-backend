
import asyncHandler from "../utils/asyncHandler.js";
import ApiErrors from "../utils/ApiErrors.js";
import {User} from "../models/user.model.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res, next) => {
    // Registration logic here
    //res.status(201).json({ message: "Incoming data..." });

    //get user details from frontend
    //validate user details
    //check if user already exists using email and username
    //check for image and check for avatar
    //upload image to cloudinary, avatar 
    //create user object- create a new user in database
    //remove password and refreshtoken from user object before sending response
    //check if user is created successfully
    //send response

    const { fullName,userName, email, password } = req.body
    //console.log("email: ", email);    
    console.log("body: ", req.body);    

    if([fullName, userName, email, password].some((field)=>field?.trim()=== ""))
    {
        throw new ApiErrors("All fields are required", 400);
    }

    const userExists = await(User.findOne({$or: [{email}, {userName}] }))
    if(userExists)
    {
        throw new ApiErrors("User already exists", 409);
    }

    const avtarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    console.log("avtarLocalPath: ", avtarLocalPath);  
    console.log("coverImageLocalPath: ", coverImageLocalPath); 
    if(!avtarLocalPath)
    {
        throw new ApiErrors("Avatar is required", 400);
    }
     if(!coverImageLocalPath)
    {
        throw new ApiErrors("Cover Iamge is required", 400);
    }

 

    const avatar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);
        
    if(!avatar)
    {
        throw new ApiErrors("Error in uploading avatar", 500);
    }
    

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        userName: userName.toLowerCase()
    }); 
    console.log("user created boss: ", user); 
    const createdUser = await User.findByIdAndUpdate(user._id).select("-password -refreshToken");

    if(!createdUser)
    {
        throw new ApiErrors("Error in creating user", 500);
    }
    return res.status(201).json(new ApiResponse(200,"User registered successfully", createdUser)); 
           
});

const generateAccessAndRefreshToken = async (userId) =>
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken() 
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
        
    } catch (error) {

        throw new ApiErrors("Error in creating userSomething went wrong in generating Refresh and Access token", 500);
    }

}

const loginUser = asyncHandler(async (req, res, next) => {
    // Login logic here
    //take username and password from req.body
    //validate username and password
    //check if user exists
    //compare password
    //generate JWT token
    //send cookie with token
    //send response with user details and token 

    const { email, userName, password } = req.body;
    if(!userName || !email || !password)
    {
        throw new ApiErrors("All fields are required", 400);
    }
    const user = await User.findOne({
        $or:[{userName},{email}]
    });

    if(!user)
    {
        throw new ApiErrors("User does not exist", 404);
    }   
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid)
    {
        throw new ApiErrors("Invalid credentials", 401);
    }   
    //generate JWT token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    

    //send cookie with token
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {message: "Login successful", user: loggedInUser, accessToken, refreshToken}
            ))
    //send response with user details and token

}); 

const logoutUser = asyncHandler(async (req, res, next) => {
    // Logout logic here
    // Clear the cookies  
    
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: undefined }

        },
        { new: true })
        
    const options = {
        httpOnly: true,
        secure: true
    };

   
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    return res.status(200).json(new ApiResponse(200, "Logout successful"));
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    // Refresh access token logic here
    // Get refresh token from cookies
    // Validate refresh token
    // Generate new access token
    // Send new access token in cookie and response 
    const { incomingRefreshToken } = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiErrors("Refresh token not found", 401);
    }

try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id);
        
        if (!user) {
            throw new ApiErrors("Invalid refresh token", 401);
        }
    
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiErrors("Refresh token not matching", 401);
    
        }
     
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                ))
    } catch (error)
    {
        throw new ApiErrors(error?.message||"Invalid refresh token", 401); 
    }
    
})
        
        


export { registerUser, loginUser,logoutUser,refreshAccessToken };// A utility function to handle async route handlers and middleware
// It catches errors and passes them to the next middleware (error handler)