import express from 'express';
import { createStudent , searchStudentsWithId } from '../controller/studentController.js'; 

const router = express.Router();

router.post('/newstudent', createStudent);

router.get("/:studentId", searchStudentsWithId);

export default router;
