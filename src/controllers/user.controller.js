import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
    // // Registration logic here
    // res.status(201).json({ message: "User registered successfully" });
    // get user data from req.body

    //get user details from front end
    //basic validation
    //check if user already exists
    //check for image file
    //hash password
    //save user to db
    //remove temp image
    //remove password and refresh token from user object
    //check user creation

    //send response

    const { username, email, password } = req.body; 

    //get useer data from frontend
    console.log(email);
    console.log(req.file); // if you're uploading a file

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields i.e. username, email, password are required" });
    }   

    // Simulate user registration (e.g., save to database)

});

const loginUser = asyncHandler(async (req, res, next) => {
    // Login logic here
    res.status(200).json({ message: "User logged in successfully" });
}); 


export { registerUser, loginUser };// A utility function to handle async route handlers and middleware
// It catches errors and passes them to the next middleware (error handler)