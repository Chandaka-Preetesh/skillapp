import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import path from "path";
import cookieParser from "cookie-parser";



import googleauthRoutes from "./routes/googleauthRoutes.js";
import emailauthRoutes from "./routes/emailauthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import doubtPlaceRoutes from "./routes/doubtplaceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import { idatabase } from "./config/idb.js";
import { configurePassport } from "./controlers/googleauthController.js";
import { verifyAuth } from "./controlers/verifyAuth.js";
import { logoutUser } from "./controlers/userController.js";

// Load environment variables
dotenv.config();


// port and server initalise

const PORT = process.env.PORT || 3000;
const app = express();


// Resolve __dirname in ES module
const __dirname = path.resolve();


// JSON request parsing
app.use(express.json());

//cors enables communication 
 app.use(cors());

 //cookie related
 app.use(cookieParser());


configurePassport();
// Helmet for security
app.use(helmet());

// HTTP request logging
app.use(morgan("dev"));

// Session configuration
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  }));
} 

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Database connection
idatabase();

// Authentication routes
app.use("/api/googleauth", googleauthRoutes);
app.use("/api/emailauth", emailauthRoutes);

// User-related data routes
app.use("/api/me", userRoutes);

// Marketplace routes
app.use("/api/marketplace", marketplaceRoutes);

// Doubts page routes
app.use("/api/doubtplace", doubtPlaceRoutes);

// Profile page routes
app.use("/api/profileplace", profileRoutes);

// Token verification
app.get("/api/auth/verify", verifyAuth);

app.post("/api/auth/logout",logoutUser);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
console.log("production ready");
}


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});