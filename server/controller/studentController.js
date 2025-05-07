import Student from "../schemas/studentSchema.js"; 

export const createStudent = async (req, res) => {
  try {
    const { name, studentId, email, phone, branch, year } = req.body;

    const newStudent = new Student({
      name,
      studentId,
      email,
      phone,
      branch,
      year,
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      message: "Student created successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const searchStudentsWithId = async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }
  try {
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    return res.status(200).json({ student });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};
