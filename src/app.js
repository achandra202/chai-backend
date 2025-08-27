import express from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // Update with your frontend URL   
    credentials: true
}));

app.use(express.json({ limit: '1mb' })); // To parse JSON bodies 
app.use(cookieParser()); // To parse cookies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static("public")); // To serve static files from the "public" directory




export default app;
