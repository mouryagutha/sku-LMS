import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc2, LoaderPinwheel, Pencil, Search } from "lucide-react";
import BookModal from '../components/BookModal';
import { getBooks, searchBooks } from '../services/services';


const BooksCatalogue = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [bankai, setBankai] = useState('');
  // const [worthy, setWorthy] = useState('');
  const roleType = localStorage.getItem("userType");
  const user = JSON.parse(localStorage.getItem("user"));
  const worthy = roleType === "admin" ? user.admin.role : '';
  // console.log(worthy);
  const navigate = useNavigate();

  const fetchBooks = async (page, search) => {
    setLoading(true);
    try {
      const response = await getBooks(page, search);
      setBooks(response.books);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBooks2 = async (query) => {
    setLoading(true);
    try {
      const response = await searchBooks(query);
      setBooks(response.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBooks(currentPage, searchText);
  }, [currentPage, searchText]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setBankai(query);
    setCurrentPage(1);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    setDebounceTimeout(
      setTimeout(() => {
        fetchBooks2(query);
      }, 500)
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full py-6 flex flex-col px-6 items-center relative">
      <h1 className="text-2xl text-start w-full font-bold text-gray-800 mb-4">Available Books</h1>
      <div className="w-full flex mb-4 justify-between">
        <div className="w-2/3 px-4 flex bg-zinc-100 items-center gap-2 border border-gray-300 rounded-lg">
          <Search className="" />
          <input
            type="text"
            className="px-4 py-2 popp bg-zinc-100 w-full focus:outline-none"
            placeholder="Search by title, ISBN, author, or location"
            value={bankai}
            onChange={handleSearchChange}
          />
        </div>
        {roleType === "admin" && (
          <button
            className="px-4 py-2 bg-zinc-800 shadow text-white rounded-lg"
            onClick={() => navigate('/addnew')}
          >
            Add a New Book
          </button>
        )}
      </div>

      {loading ? (
        <div className="w-full flex items-center justify-center py-6">
          <LoaderPinwheel className="w-10 h-10 text-gray-600 animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="w-full flex items-center justify-center py-6">
          <p className="text-gray-600">No books found matching your criteria.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="popp">
                <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">S.No</th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">ISBN</th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Title</th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Author</th>
                <th className="px-2 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Copies</th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Location</th>
                {worthy === 'admin' && (
                  <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Edit</th>
                )}
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index} className="hover:bg-gray-50 popp cursor-pointer" onClick={() => setSelectedBook(book)}>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.isbn}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.title}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.author}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.copies.filter(copy => copy.status === 'available').length} / {book.copies.length}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{book.location}</td>
                  {worthy === 'admin' && (
                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                      <Pencil className='size-7 border p-1.5 rounded-lg' />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="w-full flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-300 shadow text-black rounded-lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-300 shadow text-black rounded-lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default BooksCatalogue;
