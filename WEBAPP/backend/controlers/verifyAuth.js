import jwt from "jsonwebtoken";
import { getUserById } from "../config/loginAndRegisterQueries.js";

import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

export const verifyAuth = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      // If access token expired, try refresh token
      if (err.name === 'TokenExpiredError') {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          return res.status(401).json({ error: 'Refresh token missing' });
        }

        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          decoded = refreshDecoded; // overwrite decoded with refresh info
        } catch {
          return res.status(401).json({ error: 'Invalid refresh token' });
        }
      } else {
        return res.status(401).json({ error: 'Invalid access token' });
      }
    }

    const user = await getUserById(decoded.userid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      {
        userid: user.userid,
        email: user.email,
        google_id: user.googleid,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      user: {
        userid: user.userid,
        email: user.email,
        full_name: user.full_name,
        google_id: user.googleid
      },
      token: newAccessToken
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token verification failed' });
  }
};
