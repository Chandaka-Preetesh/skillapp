import express from 'express';

import { registerUser} from '../controlers/emailauthController.js';
import { loginUser } from '../controlers/emailauthController.js';
import { refreshToken} from '../controlers/emailauthController.js';
import { logoutUser } from '../controlers/emailauthController.js';



const router = express.Router();


//User registration end point
router.post('/register',registerUser);
// Login endpoint
router.post('/login',loginUser);

// Get current user
/*
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data
    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      profile_picture_url: user.profile_picture_url,
      google_id: user.google_id,
      created_at: user.created_at,
      last_login: user.last_login,
      isGoogleAuth: !!user.google_id
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/

//  refresh token updation route
router.post('/refresh', refreshToken);

// Logout endpoint 
router.post('/logout', logoutUser);

export default router; 