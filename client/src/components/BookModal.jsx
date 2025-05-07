import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookModal = ({ book, onClose }) => {
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('No Description Available');

  useEffect(() => {
    const fetchBookDetails = async (isbn) => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const bookData = response.data.items[0].volumeInfo;
        const coverUrl = bookData.imageLinks?.thumbnail || '';
        const bookDescription = bookData.description || '';
        setDescription(bookDescription);
        setImage(coverUrl);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    if (book) {
      fetchBookDetails(book.isbn);
    }
  }, [book]);

  const truncateDescription = (desc, wordLimit) => {
    if (!desc) return 'No Description Available';

    const words = desc.split(' ');
    if (words.length <= wordLimit) return desc;

    return words.slice(0, wordLimit).join(' ') + '...';
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99] bg-gray-800 backdrop-blur-sm bg-opacity-75">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full">
        <div className="bg-zinc-100 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">{book.title}</h2>
          <button
            className="text-red-700 font-semibold bg-red-200 px-2 rounded-lg hover:text-red-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="w-full flex justify-center">
            {image && <img src={image} alt={book.title} className="w-1/2 object-cover mb-4" />}
          </div>
          <p className="text-md text-gray-700"><strong>Author:</strong> {book.author}</p>
          <p className="text-md text-gray-700"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="text-md text-gray-700"><strong>Location:</strong> {book.location}</p>
          <p className="text-md text-gray-700"><strong>Description:</strong> {truncateDescription(description, 50)}</p>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
