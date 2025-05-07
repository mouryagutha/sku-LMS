import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Disc2, Search } from "lucide-react";
import { unreturnedBooks1, returnBook } from "../services/services";
import { getLoanById } from "../services/loanservices";
import SearchBar from "../components/returnbooks/SearchBar";
import BookTable from "../components/returnbooks/BookTable";
import ConfirmReturnModal from "../components/returnbooks/ConfirmReturnModal";
import QRScanner from "../components/returnbooks/QRScanner";

const ReturnBooks = () => {
  const [unreturnedBooks, setUnreturnedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loan, setLoan] = useState(null);

  const handleReturn = () => {
    if (!selectedBook) {
      toast.error("Please select a book to return.");
      return;
    }
    setIsReturning(true);
  };

  const fetchUnreturnedBooks = async () => {
    try {
      const books = await unreturnedBooks1();
      setUnreturnedBooks(books);
      console.log(books);
    } catch (error) {
      console.error("Error fetching unreturned books:", error);
      toast.error("An error occurred while fetching unreturned books.");
    }
  };

  useEffect(() => {
    fetchUnreturnedBooks();
  }, []);

  const handleConfirmReturn = async () => {
    if (!selectedBook) return;

    setIsReturning(false);
    try {
      const response = await returnBook(selectedBook._id);
      toast.success(response.message);
      fetchUnreturnedBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to return book");
    }
  };

  const handleQRScan = async (data) => {
    if (data) {
      try {
        const loanId = data;
        const res = await getLoanById(loanId);
        const loan = res;
        setLoan(loan);
        setSelectedBook(loan);
        handleReturn();
      } catch (error) {
        toast.error("Invalid QR code. Please try again.");
      }

      setShowQRScanner(false);
    }
  };

  const handleSelectBook = (book) => {
    if (selectedBook === book) {
      setSelectedBook(null);
    } else {
      setSelectedBook(book);
    }
  };

  const handleQRScanError = (error) => {
    console.error(error);
    toast.error("Error scanning QR code. Please try again.");
    setShowQRScanner(false);
  };

  const filteredBooks = unreturnedBooks.filter((book) => {
    const title = book?.bookDetails[0]?.title?.toLowerCase() || "";
    const isbn = book?.bookDetails[0]?.isbn?.toLowerCase() || "";
    const searchLower = searchText.toLowerCase();

    return title.includes(searchLower) || isbn.includes(searchLower);
  });

  return (
    <div className="w-full py-6 flex flex-col items-center">
      <div className="w-full px-6 border-b sticky top-14 bg-white/60 backdrop-blur-sm pb-4 z-20 flex flex-col items-center justify-between">
        <h1 className="text-2xl text-start w-full font-bold text-gray-800">
          Return Books
        </h1>
        <div className="w-full py-3 gap-3 flex justify-between">
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <div className="flex items-center gap-4">
            <button
              className="px-8 py-2 bg-zinc-900 shadow flex items-center gap-3 text-white rounded-lg"
              onClick={handleReturn}
            >
              Return
              <Disc2 className="size-5" />
            </button>
            <button
              className="px-8 py-2 bg-blue-600 shadow flex items-center gap-3 text-white rounded-lg"
              onClick={() => setShowQRScanner(true)}
            >
              ScanQR
            </button>
          </div>
        </div>
      </div>
      <div className="w-full px-6 overflow-x-auto">
        <BookTable
          books={filteredBooks}
          selectedBook={selectedBook}
          handleSelectBook={handleSelectBook}
        />
      </div>

      {isReturning && (
        <ConfirmReturnModal
          book={selectedBook}
          onConfirm={handleConfirmReturn}
          onCancel={() => setIsReturning(false)}
        />
      )}

      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onError={handleQRScanError}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default ReturnBooks;
