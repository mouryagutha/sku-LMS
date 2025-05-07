import React from 'react';

const calculateStatus = (borrowDate) => {
  const borrowDateObj = new Date(borrowDate);
  const dueDate = new Date(borrowDateObj);
  dueDate.setHours(dueDate.getHours() + 12);
  const currentDate = new Date();
  return currentDate > dueDate ? 'Overdue' : 'Before Due';
};

const BookTable = ({ books, selectedBook, handleSelectBook }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
      <thead>
        <tr className='popp'>
          <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Select</th>
          <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">S.No</th>
          <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">ISBN</th>
          <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Title</th>
          <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Borrower</th>
          <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Borrow Date</th>
          <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Status</th>
        </tr>
      </thead>
      {books.length === 0 ? (
        <tbody>
          <tr>
            <td colSpan="7" className="px-4 py-4 text-center text-gray-600">No unreturned books at the moment.</td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {books.map((loan, index) => (
            <React.Fragment key={loan._id}>
              {loan.bookDetails.map((book, bookIndex) => (
                <tr
                  key={`${loan._id}-${book._id}`}
                  className={`hover:bg-gray-50 popp cursor-pointer ${selectedBook === loan ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelectBook(loan)}
                >
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedBook === loan}
                      onChange={() => handleSelectBook(loan)}
                    />
                  </td>
                  <td className="px-4 py-4 border-b truncate border-gray-200 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-4 border-b truncate border-gray-200 text-sm text-gray-700">{book.isbn}</td>
                  <td className="px-4 py-4 border-b truncate border-gray-200 text-sm text-gray-700">{book.title}</td>
                  <td className="px-4 py-4 border-b truncate border-gray-200 text-sm text-gray-700">{loan.studentId.name}</td>
                  <td className="px-4 py-4 border-b truncate border-gray-200 text-sm text-gray-700">
                    {new Date(loan.date).toLocaleString('en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </td>
                  <td className={`px-4 py-4 border-b truncate border-gray-200 text-sm ${calculateStatus(loan.date) === 'Overdue' ? 'text-red-500' : 'text-green-600'}`}>
                    {calculateStatus(loan.date)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      )}
    </table>
  );
};

export default BookTable;
