import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import path from "path";

import googleauthRoutes from "./routes/googleauthRoutes.js";
import emailauthRoutes from "./routes/emailauthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import doubtPlaceRoutes from "./routes/doubplaceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import { idatabase } from "./config/idb.js";
import { configurePassport } from "./controlers/googleauthController.js";
import { verifyAuth } from "./controlers/verifyAuth.js";

// Resolve __dirname in ES module
const __dirname = path.resolve();

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// JSON request parsing
app.use(express.json());

// CORS settings
if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
} else {
  app.use(cors());
}
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
} else {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  }));
}

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Database connection
idatabase();

// Basic API check

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

// Get user session data
app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

// Logout handler
app.get("/auth/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
console.log("productiob ready");
}

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.get("/", (req, res) => {
  res.send("Hello from backend");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});