import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: any;
}

export const simpleAuth = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // For now, we'll use a simple approach with userId in headers or body
      const userId = req.headers['x-user-id'] || req.body.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User ID required in headers (x-user-id) or body (userId)' 
        });
      }

      // Find user in database
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Attach user to request
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed' 
      });
    }
  };
};
