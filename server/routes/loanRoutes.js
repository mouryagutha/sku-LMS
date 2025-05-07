import express from "express";
import {
  addLoan,
  returnLoan,
  overdue,
  studentOverdue,
  getBookLoans,
  getAllLoans,
  unreturnedBooks,
  getLoanById,
  getStudentLoans
} from "../controller/loanController.js";
import { validateAdminToken } from "../utils/middleWare.js";

const router = express.Router();

router.post("/add-loan",validateAdminToken, addLoan);

router.post("/return-loan",validateAdminToken, returnLoan);

router.get("/overdue", overdue);

router.get("/overdue-student", studentOverdue);
router.get("/all-loans", getAllLoans);
router.get("/unreturned-books", unreturnedBooks);

router.get("/loansbybook/:bookId", getBookLoans);

router.get("/getloanbyid/:id", getLoanById);
router.get("/student/:studentId", getStudentLoans);

export default router;
