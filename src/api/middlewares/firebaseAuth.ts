import { Request, Response, NextFunction } from 'express';
import { admin } from '../../config/firebase';
import User from '../../models/user';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: any;
}

export const firebaseAuth = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          message: 'No token provided or invalid format' 
        });
      }

      const token = authHeader.split(' ')[1];
      
      // Verify the Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Find or create user in database
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          email: decodedToken.email || '',
          userName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          firebaseUid: decodedToken.uid,
          firebaseSignInProvider: decodedToken.firebase.sign_in_provider,
          isEmailVerified: decodedToken.email_verified || false,
        });
        
        await user.save();
        console.log('New user created:', user._id);
      }

      // Attach user to request
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Firebase auth error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  };
};
