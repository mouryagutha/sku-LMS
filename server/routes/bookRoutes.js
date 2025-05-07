import express from "express";
import { addBook, getBooks, searchbook, isBookExists, updateBook } from "../controller/bookController.js";
import { validateAdminToken } from '../utils/middleWare.js';

const bookRoutes = express.Router();

// Routes that require admin validation
bookRoutes.post("/addbook", validateAdminToken, addBook);
bookRoutes.post('/updatebook', validateAdminToken, updateBook);

// Public routes
bookRoutes.get("/getbooks", getBooks);
bookRoutes.get("/searchbook", searchbook);
bookRoutes.get("/isBookExists", isBookExists);

export default bookRoutes;
