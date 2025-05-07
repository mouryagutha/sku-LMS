import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  bookCopyCodes: [{ type: String, required: true }],
  status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' },
  date: { type: Date, default: Date.now },
  returned: { type: Date },
  bookDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] 
});

export default mongoose.model('Loan', loanSchema);
