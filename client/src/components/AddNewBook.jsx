import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import { addBook, isBookExists, updateBook } from '../services/services';

const AddNewBook = () => {
    const [book, setBook] = useState({
        title: '',
        isbn: '',
        author: '',
        genre: '',
        category: '',
        copies: [{ code: '', status: 'available' }],
        location: '',
        description: '',
        image: null,
        coverUrl: ''
    });
    const [isExisting, setIsExisting] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setBook((prevBook) => ({
            ...prevBook,
            [id]: value
        }));

        if (id === 'isbn' && value.length === 13) {
            fetchBookDetails(value);
        }
    };

    const handleCopyChange = (index, e) => {
        const { value } = e.target;
        setBook((prevBook) => ({
            ...prevBook,
            copies: prevBook.copies.map((copy, i) => (i === index ? { ...copy, code: value } : copy))
        }));
    };

    const handleAvailabilityChange = (index, e) => {
        const { value } = e.target;
        setBook((prevBook) => ({
            ...prevBook,
            copies: prevBook.copies.map((copy, i) => (i === index ? { ...copy, status: value } : copy))
        }));
    };

    const handleFileChange = (e) => {
        setBook((prevBook) => ({
            ...prevBook,
            image: e.target.files[0]
        }));
    };

    const fetchBookDetails = async (isbn) => {
        try {
            const response = await isBookExists(isbn);
            if (response.exists) {
                setIsExisting(true);
                const existingBook = response.book;
                setBook((prevBook) => ({
                    ...prevBook,
                    ...existingBook
                }));
                toast.success('Book with this ISBN already exists. Existing details loaded.');
            } else {
                setIsExisting(false);
                const googleBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
                const bookData = googleBooksResponse.data.items[0].volumeInfo;
                const coverUrl = bookData.imageLinks?.thumbnail || '';
                setBook((prevBook) => ({
                    ...prevBook,
                    title: bookData.title || '',
                    author: bookData.authors ? bookData.authors.join(', ') : '',
                    genre: bookData.categories ? bookData.categories.join(', ') : '',
                    description: bookData.description || '',
                    coverUrl: coverUrl
                }));
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    const addCopy = () => {
        setBook((prevBook) => ({
            ...prevBook,
            copies: [...prevBook.copies, { code: '', status: 'available' }]
        }));
    };

    const removeCopy = (index) => {
        setBook((prevBook) => ({
            ...prevBook,
            copies: prevBook.copies.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { image, ...bookData } = book;

            // Check if all copies have unique codes
            const codes = bookData.copies.map((copy) => copy.code);
            if (new Set(codes).size !== codes.length) {
                toast.error('All copies must have unique codes.');
                return;
            }

            if (isExisting) {
                await updateBook(bookData);
            } else {
                await addBook(bookData);
            }

            setBook({
                title: '',
                isbn: '',
                author: '',
                genre: '',
                category: '',
                copies: [{ code: '', status: 'available' }],
                location: '',
                description: '',
                image: null,
                coverUrl: ''
            });
            setIsExisting(false);
        } catch (response) {
            toast.error('Failed to save book. Please try again.');
            console.log('Error:', response);
        }
    };

    return (
        <div className="w-full flex py-6 flex-col px-6 items-center">
            <h1 className="text-2xl text-start w-full font-bold text-gray-800 mb-4">{isExisting ? 'Update Book' : 'Add a New Book'}</h1>
            <div className="flex flex-row w-full max-w-4xl">
                <form className="w-full" onSubmit={handleSubmit}>
                    <InputField id="title" label="Title" value={book.title} onChange={handleChange} placeholder="Book Title" />
                    <InputField id="isbn" label="ISBN" value={book.isbn} onChange={handleChange} placeholder="ISBN Number" />
                    <InputField id="author" label="Author" value={book.author} onChange={handleChange} placeholder="Author Name" />
                    <InputField id="genre" label="Genre" value={book.genre} onChange={handleChange} placeholder="Genre" />
                    <InputField id="category" label="Category" value={book.category} onChange={handleChange} placeholder="Category" />
                    <TextAreaField id="description" label="Description" value={book.description} onChange={handleChange} placeholder="Book Description" />
                    <p className="text-sm font-bold text-gray-800 mt-4">Unique Ids</p>
                    {book.copies.map((copy, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className='flex flex-col'>
                                <InputField id={`copy-code-${index}`} name="code" value={copy.code} onChange={(e) => handleCopyChange(index, e)} placeholder="Code" required />
                                {!copy.code && <span className="text-red-500 text-xs ml-2 -mt-3">Code is required *</span>}
                            </div>
                            <select
                                name="status"
                                value={copy.status}
                                onChange={(e) => handleAvailabilityChange(index, e)}
                                className="border rounded p-2 my-2"
                            >
                                <option value="available">Available</option>
                                <option value="borrowed">Borrowed</option>
                            </select>
                            <button type="button" onClick={() => removeCopy(index)} className="my-2 bg-red-200 py-2 px-4 rounded-lg text-red-500">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addCopy} className="my-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                        Add Copy
                    </button>
                    <InputField id="location" label="Location" value={book.location} onChange={handleChange} placeholder="Book Location" />
                    <InputField id="image" label="Image" type="file" onChange={handleFileChange} placeholder="Book Image" />
                    <div className="flex items-center justify-between">
                        <button className="bg-zinc-900 hover:bg-zinc-800 py-2 text-white font-bold w-full rounded-lg focus:outline-none focus:shadow-outline" type="submit">
                            {isExisting ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
                {book.coverUrl && <div className="w-1/2 flex justify-center items-start px-8">
                    <img src={book.coverUrl} alt="Book Cover" className="w-40 h-60 object-cover rounded-lg" />
                </div>}
            </div>
        </div>
    );
};

export default AddNewBook;
