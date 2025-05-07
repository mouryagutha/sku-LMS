import mongoose from 'mongoose';

const copySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'borrowed'], default: 'available' },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isbn: { type: String, unique: true },
  author: { type: String },
  genre: { type: String },
  category: { type: String },
  copies: [copySchema],
  location: { type: String }
});

export default mongoose.model('Book', bookSchema);
