
import asyncHandler from "../utils/asyncHandler.js";
import ApiErrors from "../utils/ApiErrors.js";
import {User} from "../models/user.model.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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

const loginUser = asyncHandler(async (req, res, next) => {
    // Login logic here
    res.status(200).json({ message: "User logged in successfully" });
}); 


export { registerUser, loginUser };// A utility function to handle async route handlers and middleware
// It catches errors and passes them to the next middleware (error handler)