import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
  },
  branch: {
    type: String,
  },
  year: {
    type: String,
  },
  dob: {
    type: String, // Change type to String
    required: true,
  },
});

export default mongoose.model("Student", studentSchema);

