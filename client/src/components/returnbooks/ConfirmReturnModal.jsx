import React from 'react';

const ConfirmReturnModal = ({ book, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white popp rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Confirm Return</h2>
        <p>Are you sure you want to return this book?</p>
        <p className="mt-2"><strong>Title: &nbsp;</strong> {book?.bookDetails?.[0]?.title}</p>
        <p className="mt-2"><strong>Borrower Name: &nbsp;</strong> {book?.studentId?.name}</p>
        <p className="mt-2"><strong>ISBN: &nbsp;</strong> {book?.bookDetails?.[0]?.isbn}</p>
        <div className="mt-4 w-full flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 w-full bg-blue-600 text-white rounded-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReturnModal;
