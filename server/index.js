import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  // origin: 'http://localhost:5173',
  origin: 'https://sku-lms.vercel.app',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Library Management System - Server');
});
app.use('/login', authRoutes);
app.use('/validate',authRoutes)
app.use('/loan', loanRoutes);
app.use('/student', studentRoutes);
app.use('/book', bookRoutes);

app.listen(3000, () => {
  connectDB();
  console.log('We are on port 3000');
});

// import Student from './schemas/studentSchema.js';

// const createStudent = async () => {
//   const dobString = '03-09-2004'; // Assuming this is in DD-MM-YYYY format

//   const newStudent = new Student({
//     name: 'Sai Aditya',
//     studentId: '002',
//     email: 'sai@gmail.com',
//     phone: '123-456-7890',
//     branch: 'Computer Science',
//     year: '3rd',
//     dob: dobString, // Save DOB as string
//   });

//   try {
//     const savedStudent = await newStudent.save();
//     console.log('Student saved:', savedStudent);
//   } catch (error) {
//     console.error('Error saving student:', error);
//   }
// };

// createStudent();

