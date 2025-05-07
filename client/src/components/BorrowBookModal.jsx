import React, { useState } from "react";
import { toast } from "sonner";

const BorrowBookModal = ({ studentDetails, selectedBooks, onClose, onConfirm, onStudentSearch }) => {
  const [studentId, setStudentId] = useState("");

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleSearchStudent = () => {
    if (studentId.trim() === "") {
      toast.error("Please enter a student ID.");
      return;
    }
    onStudentSearch(studentId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg w-5/6 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Confirm Borrow</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-lg"
            value={studentId}
            onChange={handleStudentIdChange}
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSearchStudent}
          >
            Search Student
          </button>
          {studentDetails.name && (
            <p className="mt-2 popp text-xl text-gray-700">Student: {studentDetails.name}</p>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Books</h3>
          <ul className="list-disc list-inside">
            {selectedBooks.map((book, index) => (
              <li key={index} className="text-gray-700">
                {book.title} by {book.author} (ISBN: {book.isbn})
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-full justify-end space-x-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-700 text-white rounded-lg"
            onClick={onConfirm}
          >
            Confirm Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowBookModal;
