import express from "express";
import helmet from "helmet";
import morgan  from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';

import testRouter from "./routes/testRoute.js";
import { sql } from "./config/idb.js";
import { idatabase } from "./config/idb.js";
import { linkGoogleAccount } from "./config/loginAndRegisterQueries.js";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//To get environamental varibiles from .env i
dotenv.config({ path: join(__dirname, '../.env') });

const PORT=process.env.PORT || 3000;

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




//passport releated middlewares  are been added to app 
app.use(passport.initialize());
app.use(passport.session());

//To serialise and deserialise
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});





// Google Strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"]
    },
    //After getting details tries to link account and return a callback to passport serialsize
    async function(accessToken, refreshToken, profile, cb) {
      try {
        // Create or update user in database
        const user = await linkGoogleAccount({
          email: profile.emails[0].value,
          full_name: profile.displayName,
          google_id: profile.id
        });

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  ));

  // Authenticationg gets started
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
//In this first passort authenticate and user data is checked in database
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=Google%20authentication%20failed' }),
    function(req, res) {
      try {
        if (!req.user) {
          console.error('OAuth callback error: No user data in request');
          return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=Authentication%20failed%20-%20No%20user%20data`);
        }

        console.log('OAuth user data:', req.user); 

        // Create JWT token
        const token = jwt.sign(
          { 
            userid: req.user.userid, 
            email: req.user.email,
            googleId: req.user.google_id,
            isGoogleAuth: true
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '24h' }
        );

        // Encode user data
        const userData = encodeURIComponent(JSON.stringify({
          userid: req.user.userid,
          email: req.user.email,
          full_name: req.user.full_name,
          google_id: req.user.google_id
        }));

        // Debug log
        console.log('Redirecting with token and user data');

        res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&user=${userData}`);
      } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication%20failed`);
      }
    }
  );
} else {
  console.log('Google OAuth credentials not found in environment variables.');
  console.log('To enable Google login, please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
}













app.get("/",(req,res)=>{
    res.send("hello from backend");
} );


app.use("/api/t",testRouter);


idatabase();

app.listen(PORT,()=>{
    console.log("server running on port "+PORT);
});