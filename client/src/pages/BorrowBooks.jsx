import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Disc2, LoaderPinwheel, Search } from "lucide-react";
import { toast } from "sonner";
import BorrowBookModal from "../components/BorrowBookModal";
import BookModal from "../components/BookModal";
import CodeSelectionModal from "../components/CodeSelectionModal";
import { borrowBooks, searchBooks, searchStudentById } from "../services/services";

const BorrowBooks = () => {
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [studentDetails, setStudentDetails] = useState({ id: "", name: "" });
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [viewBook, setViewBook] = useState(null);
  const [codeSelectionBook, setCodeSelectionBook] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [loading, setLoading] = useState(false);
  const roleType = localStorage.getItem("userType");
  const user = JSON.parse(localStorage.getItem("user"));
  const issuedBy = roleType === "admin" ? user.admin.id : '';
  console.log(issuedBy);

  const navigate = useNavigate();

  const fetchBooks = async (query) => {
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

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchText(query);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (query.length === 0) {
      setBooks([]);
      return;
    }
    setDebounceTimeout(
      setTimeout(() => {
        fetchBooks(query);
      }, 1500)
    );
  };

  const handleStudentSearch = async (id) => {
    try {
      const response = await searchStudentById(id);
      setStudentDetails({ id: response.student._id, name: response.student.name });
      toast.success(`Student found: ${response.student.name}`);
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Student not found");
    }
  };

  const handleBorrow = () => {
    if (selectedBooks.length === 0) {
      toast.error("Please select at least one book to borrow.");
      return;
    }
    if (selectedBooks.length > 5) {
      toast.error("You cannot borrow more than 5 books at a time.");
      return;
    }
    setIsBorrowing(true);
  };

  const handleConfirmBorrow = async () => {
    setIsBorrowing(false);
    console.log(studentDetails.id);
    try {
      await borrowBooks(
        studentDetails.id,
        issuedBy,
        selectedBooks.map((book) => book._id),
        selectedBooks.map((book) => book.code)
      );
      toast.success(
        `Books borrowed by ${studentDetails.name} (ID: ${studentDetails.id})`
      );
      setSelectedBooks([]);
      setStudentDetails({ id: "", name: "" });
    } catch (error) {
      console.error("Error borrowing books:", error);
      toast.error(error.response?.data?.message || "Failed to borrow books");
    }
  };

  const handleClick = (book) => {
    setCodeSelectionBook(book);
  };

  const handleSelectBook = (code) => {
    const book = codeSelectionBook;

    // Check if the book with the same ISBN already exists in selectedBooks
    const existingBookIndex = selectedBooks.findIndex(b => b.isbn === book.isbn);

    if (existingBookIndex !== -1) {
      // Replace the existing book with the new code
      const updatedBooks = [...selectedBooks];
      updatedBooks[existingBookIndex] = {
        ...book,
        code,
      };
      setSelectedBooks(updatedBooks);
    } else {
      // Add the new book to the list
      const newBook = {
        ...book,
        code,
      };
      setSelectedBooks([...selectedBooks, newBook]);
    }

    setCodeSelectionBook(null);
  };


  const handleRemoveBook = (book) => {
    setSelectedBooks(selectedBooks.filter((b) => b !== book));
  };

  return (
    <div className="w-full py-6 mt-16 md:mt-0 flex flex-col px-6 items-center relative">
      <h1 className="text-2xl px-3 text-start w-full font-bold text-gray-800 mb-4">
        Issue Books
      </h1>
      <div className="w-full px-3 flex mb-4 justify-between">
        <div className="w-2/3 px-4 flex bg-zinc-100 items-center gap-2 border border-gray-300 rounded-lg">
          <Search className="" />
          <input
            type="text"
            className="px py-2 popp rounded-lg bg-zinc-100 w-full focus:outline-none"
            placeholder="Search by title or ISBN"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="px-8 py-2 bg-zinc-900 shadow flex items-center gap-3 text-white rounded-lg"
          onClick={handleBorrow}
        >
          Borrow
          <Disc2 className="size-5" />
        </button>
      </div>

      {loading ? (
        <div className="w-full flex items-center justify-center py-6">
          <LoaderPinwheel className="w-10 h-10 text-gray-600 animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="w-full flex items-center justify-center py-6">
          <p className="text-gray-600">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="popp">
                <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  Select
                </th>
                <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  S.No
                </th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  ISBN
                </th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  Author
                </th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 popp cursor-pointer ${selectedBooks.some(b => b._id === book._id) ? "bg-gray-200" : ""
                    }`}
                  onClick={() => handleClick(book)}
                >
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedBooks.some(b => b._id === book._id)}
                      onChange={() => handleClick(book)}
                    />
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    {book.isbn && book.isbn}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    {book.title && book.title}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    {book.author && book.author}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    {book.copies.filter(copy => copy.status === 'available').length} / {book.copies.length}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    <button
                      className="px-3 py-1 bg-zinc-700 text-white rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewBook(book);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewBook && (
        <BookModal
          book={viewBook}
          onClose={() => setViewBook(null)}
        />
      )}

      {codeSelectionBook && (
        <CodeSelectionModal
          book={codeSelectionBook}
          onSelectCode={handleSelectBook}
          onClose={() => setCodeSelectionBook(null)}
        />
      )}

      {isBorrowing && (
        <BorrowBookModal
          studentDetails={studentDetails}
          selectedBooks={selectedBooks}
          onClose={() => setIsBorrowing(false)}
          onConfirm={handleConfirmBorrow}
          onStudentSearch={handleStudentSearch}
        />
      )}

      {selectedBooks.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg border border-gray-200 p-4 max-w-xl">
          <h3 className="text-lg font-semibold mb-2">Selected Books</h3>
          <ul>
            {selectedBooks.map((book) => (
              <li key={book._id} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{book.title}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-1"
                    value={book.code || ""}
                    readOnly
                  />
                  <button
                    className="text-red-600"
                    onClick={() => handleRemoveBook(book)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BorrowBooks;
