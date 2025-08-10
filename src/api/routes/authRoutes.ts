import { Router } from 'express';
import { Request, Response } from 'express';
import User from '../../models/user';
import { logger } from '../../utils/helpers/logger';

const router = Router();

// Simple user registration endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, userName, firebaseUid } = req.body;

    // Validate required fields
    if (!email || !userName || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Email, username, and firebaseUid are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { firebaseUid }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const newUser = new User({
      email,
      userName,
      firebaseUid,
      firebaseSignInProvider: 'password', // default
      isEmailVerified: false,
      hasCompletedOnboarding: false
    });

    await newUser.save();
    logger.info('New user registered:', { userId: newUser._id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        hasCompletedOnboarding: newUser.hasCompletedOnboarding
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Simple user login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'FirebaseUid is required'
      });
    }

    // Find user by firebaseUid
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

export default router;
