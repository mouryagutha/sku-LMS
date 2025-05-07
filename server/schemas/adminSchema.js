import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'faculty']
  }
});

export default mongoose.model('Admin', adminSchema);
