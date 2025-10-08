import e from "express";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
    // Registration logic here
    res.status(201).json({ message: "User registered successfully" });

    //get user details from frontend
    //validate user details
    //check if user already exists using email and username
    //check for image and check for avatar
    //upload image to cloudinary, avatar 
    //create user object- create a new user in database
    //remove password and refreshtoken from user object before sending response
    //check if user is created successfully
    //send response

    const { fullName,username, email, password } = req.body
    console.log("email: ", email);    
           
});

const loginUser = asyncHandler(async (req, res, next) => {
    // Login logic here
    res.status(200).json({ message: "User logged in successfully" });
}); 


export { registerUser, loginUser };// A utility function to handle async route handlers and middleware
// It catches errors and passes them to the next middleware (error handler)