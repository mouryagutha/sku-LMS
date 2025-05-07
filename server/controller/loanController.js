import mongoose from "mongoose";
import Book from "../schemas/bookSchema.js";
import Loan from "../schemas/loanSchema.js";
import Student from "../schemas/studentSchema.js";
import { generateQRCode } from "../utils/qrCodeHelper.js";
import Admin from "../schemas/adminSchema.js";
import { sendEmail } from "../utils/emailHelper.js";

export const addLoan = async (req, res) => {
  const { studentId, bookCopyCodes, issuedBy } = req.body;
  console.log('isss:', issuedBy);
  console.log('studentId:', studentId);
  console.log('bookCopyCodes:', bookCopyCodes);
  console.log('issuedBy:', issuedBy);

  // Validate ObjectIds
  if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(issuedBy)) {
    return res.status(400).json({ message: "Invalid student ID or admin ID" });
  }

  // Validate bookCopyCodes
  if (!Array.isArray(bookCopyCodes) || !bookCopyCodes.every(code => typeof code === 'string')) {
    return res.status(400).json({ message: "Invalid book copy codes" });
  }

  try {
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if admin exists
    const admin = await Admin.findById(issuedBy);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find books with the given copy codes
    const books = await Book.find({ "copies.code": { $in: bookCopyCodes } });

    // Validate that all provided copy codes were found
    const foundCopyCodes = books.flatMap(book => book.copies.map(copy => copy.code));
    const missingCopyCodes = bookCopyCodes.filter(code => !foundCopyCodes.includes(code));
    if (missingCopyCodes.length > 0) {
      return res.status(404).json({ message: "Some book copies not found", missingCopyCodes });
    }

    // Check availability of each copy code
    const unavailableCopies = [];
    books.forEach(book => {
      book.copies.forEach(copy => {
        if (bookCopyCodes.includes(copy.code) && copy.status !== 'available') {
          unavailableCopies.push(copy.code);
        }
      });
    });
    if (unavailableCopies.length > 0) {
      return res.status(400).json({ message: "Some book copies are not available", unavailableCopies });
    }

    // Update the status of each copy to 'borrowed'
    await Promise.all(
      books.map(async (book) => {
        book.copies.forEach(copy => {
          if (bookCopyCodes.includes(copy.code)) {
            copy.status = 'borrowed';
          }
        });
        await book.save();
      })
    );

    // Create a new loan
    const loan = new Loan({
      studentId,
      issuedBy,
      bookCopyCodes,
      bookDetails: books.map(book => book._id),
      status: "borrowed",
    });
    await loan.save();

    const bookNames = books.map(book => book.title);

    // Generate QR code and send email
    const qrCode = await generateQRCode(loan._id);
    const emailSent = await sendEmail(student.email, student.name, qrCode, bookNames);

    if (!emailSent) {
      return res.status(500).json({ message: "Error sending email" });
    }

    res.status(200).json({ message: "Loan created and QR code sent to email" });
  } catch (error) {
    console.error(error); // Improved error logging
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};


export const returnLoan = async (req, res) => {
  const { loanId } = req.body;

  if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
    return res.status(400).json({ message: "Invalid loan ID" });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status === "returned") {
      return res.status(400).json({ message: "Loan has already been returned" });
    }

    loan.status = "returned";
    loan.returned = new Date();
    await loan.save();

    // Update the status of each book copy to 'available'
    const bulkOps = loan.bookCopyCodes.map((code) => ({
      updateOne: {
        filter: { "copies.code": code },
        update: { $set: { "copies.$.status": 'available' } },
      },
    }));

    await Book.bulkWrite(bulkOps);

    res.status(200).json({ message: "Books successfully returned" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const overdue = async (req, res) => {
  const OVERDUE_DAYS = process.env.OVERDUE_DAYS || 7;

  try {
    const currentDate = new Date();
    const overdueLoans = await Loan.find({
      returned: { $exists: false },
      date: { $lt: new Date(currentDate.setDate(currentDate.getDate() - OVERDUE_DAYS)) },
    });

    res.status(200).json(overdueLoans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const studentOverdue = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  try {
    const currentDate = new Date();
    const overdueLoans = await Loan.find({
      studentId,
      returned: { $exists: false },
      date: { $lt: new Date(currentDate.setDate(currentDate.getDate() - OVERDUE_DAYS)) },
    });

    res.status(200).json(overdueLoans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookLoans = async (req, res) => {
  const { bookId } = req.params;
  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const bookLoans = await Loan.find({
      bookCopyCodes: bookId, // Use `bookCopyCodes` instead of `bookId`
      returned: { $exists: false },
    }).populate({
      path: "studentId",
      select: "name email",
    });

    if (!bookLoans.length) {
      return res.status(404).json({ message: "No active loans found for this book" });
    }

    return res.status(200).json(bookLoans);
  } catch (error) {
    console.error("Error fetching book loans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const loans = await Loan.find({})
      .populate({
        path: 'studentId',
        select: 'name email'
      })
      .populate({
        path: 'bookCopyCodes',
        select: 'title author isbn'
      })
      .populate({
        path: 'bookDetails',
        select: 'title author isbn'
      })
      .populate({
        path: 'issuedBy',
        select: 'name email'
      })
      .skip(skip)
      .limit(parseInt(limit));

    const totalLoans = await Loan.countDocuments();

    return res.status(200).json({ loans, totalLoans });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};


export const getLoanById = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid loan ID" });
  }

  try {
    const loan = await Loan.findById(id)
      .populate({
        path: 'studentId',
        select: 'name email'
      })
      .populate({
        path: 'bookCopyCodes',
        select: 'title author isbn'
      }).populate({
        path: 'bookDetails',
        select: 'title author isbn'
      });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    return res.status(200).json(loan);
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const unreturnedBooks = async (req, res) => {
  try {
    const unreturnedLoans = await Loan.find({
      returned: { $exists: false }
    })
      .populate({
        path: 'studentId',
        select: 'name studentId'
      })
      .populate({
        path: 'bookCopyCodes',
        select: 'title author isbn bookCopyCodes status'
      })
      .populate({
        path: 'bookDetails', 
        select: 'title author isbn'
      });

    res.json(unreturnedLoans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getStudentLoans = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate the studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const loans = await Loan.find({ studentId })
      .populate({
        path: 'studentId',
        select: 'name email'
      })
      .populate({
        path: 'bookCopyCodes',
        select: 'title author isbn'
      })
      .populate({
        path: 'bookDetails',
        select: 'title author isbn'
      })
      .populate({
        path: 'issuedBy',
        select: 'name email'
      });

    if (!loans.length) {
      return res.status(404).json({ error: 'No loans found for this student' });
    }

    return res.status(200).json({ loans });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
