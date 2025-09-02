import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
    // Registration logic here
    res.status(201).json({ message: "User registered successfully" });
});

const loginUser = asyncHandler(async (req, res, next) => {
    // Login logic here
    res.status(200).json({ message: "User logged in successfully" });
}); 


export { registerUser, loginUser };// A utility function to handle async route handlers and middleware
// It catches errors and passes them to the next middleware (error handler)