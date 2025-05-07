import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Search, Disc2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Overdue = () => {
  const navigate = useNavigate();
  const [overdueBooks, setOverdueBooks] = useState([
    {
      serialNumber: 1,
      isbn: '978-0131103627',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      borrowedBy: 'John Doe',
      borrowDate: '2023-06-01',
      dueDate: '2023-06-15',
      status: 'Overdue',
    },
    {
      serialNumber: 2,
      isbn: '978-0132350884',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      borrowedBy: 'Jane Smith',
      borrowDate: '2023-05-20',
      dueDate: '2023-06-10',
      status: 'Overdue',
    },
    // Add more overdue books as needed
  ]);
  const [searchText, setSearchText] = useState('');

  // Function to handle borrowing books
  const handleBorrow = () => {

    navigate('/borrow');
  };

  // Function to handle exporting data to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(overdueBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Overdue Books');
    XLSX.writeFile(workbook, 'OverdueBooks.xlsx');
  };

  const filteredBooks = overdueBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full py-6 flex flex-col px-6 items-center">
      <h1 className="text-2xl text-start w-full font-bold text-gray-800 mb-4">Overdue Books</h1>
      <div className="flex w-full py-4 px-3 items-center justify-between">
        <div className="w-2/3 px-4 flex bg-zinc-100 items-center gap-2 border border-gray-300 rounded-lg">
          <Search className='' />
          <input
            type="text"
            className="px py-2 popp rounded-lg bg-zinc-100 w-full focus:outline-none"
            placeholder="Search by title or ISBN"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-8 py-2 bg-zinc-900 shadow flex items-center gap-3 text-white rounded-lg"
            onClick={handleBorrow}
          >
            Borrow
            <Disc2 className='size-5' />
          </button>
          <button
            className=" px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </button>
        </div>
      </div>
      {filteredBooks.length === 0 ? (
        <p className="text-gray-600">No overdue books at the moment.</p>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className='popp'>
                  <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">S.No</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">ISBN</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Title</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Author</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Borrowed By</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Borrow Date</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Due Date</th>
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={index} className="hover:bg-gray-50 popp">
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.serialNumber}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.isbn}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.title}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.author}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.borrowedBy}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.borrowDate}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.dueDate}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                      <span className="bg-red-200 text-red-700 font-semibold py-1 px-2 rounded-full text-xs">
                        {book.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Overdue;
