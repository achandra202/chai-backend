import express from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Update with your frontend URL   
    credentials: true
}));

app.use(express.json({ limit: '1mb' })); // To parse JSON bodies 
app.use(cookieParser()); // To parse cookies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static("public")); // To serve static files from the "public" directory


// Import routes here
import userRoutes from "./routes/user.routes.js";

// User routes declared here
app.use("/api/v1/users", userRoutes);

// http://localhost:8000/api/v1/users/register


// Global error handling middleware
export { app };
