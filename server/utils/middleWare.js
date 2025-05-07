
import jwt from 'jsonwebtoken';
import Admin from '../schemas/adminSchema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const validateAdminToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect 'Bearer <token>'
    console.log('Token:', token); // Log token to check if Authorization header is present
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // If token is valid and admin is found, proceed to the next middleware/controller
      req.admin = admin;
      next();
    } catch (err) {
      console.error('Token validation error:', err);
      res.status(401).json({ message: 'Invalid token' });
    }
  };