import jwt from 'jsonwebtoken';
import Admin from '../schemas/adminSchema.js';
import Student from '../schemas/studentSchema.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log('Admin login request body:', req.body);

  try {
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (password !== admin.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const formatDateString = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

export const studentLogin = async (req, res) => {
  const { email, password } = req.body; 
  console.log('Student login request body:', req.body); // Log to ensure correct data

  const dob = formatDateString(password); 
  console.log('Formatted DOB:', dob);

  try {
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    // Find the student by registration number (email in this case)
    const student = await Student.findOne({ studentId: email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

   
    const inputDob = dob;
    const studentDob = await student.dob;

    // Check if the provided date of birth matches the stored one
    if (inputDob!== studentDob) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the student
    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, student: { id: student._id, regNo: student.studentId, email: student.email, name: student.name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validateAdminToken = async (req, res) => {
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

    // give an response if the token is valid

    res.status(200).json({ message: 'Token is valid', admin });


  } catch (err) {
    console.error('Token validation error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

