import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import session from 'express-session';
import passport from 'passport';

import testRouter from "./routes/testRoute.js";
import authRouter from "./routes/authRoutes.js";
import { sql } from "./config/idb.js";
import { idatabase } from "./config/idb.js";
import { configurePassport } from "./controlers/authController.js";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//To get environamental varibiles from .env i
dotenv.config({ path: join(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

//adding security middleware 
app.use(helmet());
//log https request
app.use(morgan("dev")); 

//cors allows frontend and backend to communicate
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Intialising session 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

//passport releated middlewares are been added to app 
app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
configurePassport();

app.get("/",(req,res)=>{
    res.send("hello from backend");
});

// Routes
app.use("/api/t", testRouter);
app.use("/auth", authRouter);

idatabase();

app.listen(PORT,()=>{
    console.log("server running on port "+PORT);
});