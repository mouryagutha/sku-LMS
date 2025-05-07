import React from 'react';
import { useParams } from 'react-router-dom';

const books = [
  {
    serialNumber: 1,
    isbn: '978-0131103627',
    title: 'Introduction to Algorithms',
    location: 'Shelf A1',
    author: 'Thomas H. Cormen',
    description: 'A comprehensive book on algorithms.',
    image: 'path_to_image',
    totalCount: 5,
    availableCount: 3,
  },
  {
    serialNumber: 2,
    isbn: '978-0132350884',
    title: 'Clean Code',
    location: 'Shelf B3',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship.',
    image: 'path_to_image',
    totalCount: 3,
    availableCount: 1,
  },
  // Add more books as needed
];

const BookDetails = () => {
  const { isbn } = useParams();
  const book = books.find(b => b.isbn === isbn);

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="w-full py-6 flex flex-col px-6 items-center">
      <h1 className="text-2xl text-start w-full font-bold text-gray-800 mb-4">{book.title}</h1>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Author: {book.author}</h2>
        <p className="text-md text-gray-700 mb-2">ISBN: {book.isbn}</p>
        <p className="text-md text-gray-700 mb-2">Location: {book.location}</p>
        <p className="text-md text-gray-700 mb-2">Description: {book.description}</p>
        <p className="text-md text-gray-700 mb-2">Total Count: {book.totalCount}</p>
        <p className="text-md text-gray-700 mb-2">Available Count: {book.availableCount}</p>
      </div>
    </div>
  );
};

export default BookDetails;
