import Book from '../schemas/bookSchema.js';

export const addBook = async (req, res) => {
  const {
    title,
    isbn,
    author,
    genre,
    category,
    copies,
    location,
  } = req.body;

  if (!title || !copies || copies.length === 0) {
    return res.status(400).json({ error: 'Title and at least one copy are required' });
  }

  const existingCopies = await Book.find({ 'copies.code': { $in: copies.map((copy) => copy.code) } });
  if (existingCopies.length > 0) {
    const existingCodes = existingCopies.map((book) => book.copies.map((copy) => copy.code)).flat();
    const duplicateCodes = copies.filter((copy) => existingCodes.includes(copy.code)).map((copy) => copy.code);
    return res.status(400).json({ error: `The following codes already exist: ${duplicateCodes.join(', ')}` });
  }

  const newBook = new Book({
    title,
    isbn,
    author,
    genre,
    category,
    copies,
    location,
  });

  try {
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ error: 'Error adding book', details: error.message });
    }
};

export const updateBook = async (req, res) => {
  const {
    title,
    isbn,
    author,
    genre,
    category,
    copies,
    location,
  } = req.body;

  if (!isbn) {
    return res.status(400).json({ error: 'ISBN is required' });
  }

  try {
    // Check if the book exists
    let book = await Book.findOne({ isbn });

    if (book) {
      // If book exists, update it
      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.category = category || book.category;
      book.location = location || book.location;

      // Update copies
      if (copies) {
        // Fetch all other books except the current one being updated
        const existingBooks = await Book.find({ isbn: { $ne: book.isbn }, 'copies.code': { $in: copies.map((copy) => copy.code) } });
        
        // Extract all existing codes from these books
        const existingCodes = existingBooks.flatMap(b => b.copies.map(copy => copy.code));

        // Find duplicate codes in the new copies
        const duplicateCodes = copies.filter(copy => existingCodes.includes(copy.code)).map(copy => copy.code);

        if (duplicateCodes.length > 0) {
          return res.status(400).json({ error: `The following codes already exist: ${duplicateCodes.join(', ')}` });
        }

        // Update copies
        book.copies = copies;
      }

      await book.save();
      res.status(200).json({ message: 'Book updated successfully', book });
    } else {
      // If book does not exist, create a new one
      const newBook = new Book({
        title,
        isbn,
        author,
        genre,
        category,
        copies,
        location,
      });

      await newBook.save();
      res.status(201).json({ message: 'Book added successfully', book: newBook });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating or adding book', details: error.message });
  }
};


export const getBooks = async (req, res) => {
  const { page = 1, search = '' } = req.query;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const regexSearch = new RegExp(search, 'i'); 
    const totalBooks = await Book.countDocuments({
      $or: [
        { title: regexSearch },
        { isbn: regexSearch },
        { author: regexSearch },
        { location: regexSearch },
      ],
    });
    const books = await Book.find({
      $or: [
        { title: regexSearch },
        { isbn: regexSearch },
        { author: regexSearch },
        { location: regexSearch },
      ],
    })
    .skip(skip)
    .limit(limit);
    
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({ books, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Error getting books', details: error.message });
  }
};

export const searchbook = async (req, res) => {
  const { query } = req.query;
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });
    res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const isBookExists = async (req, res) => {
  const { isbn } = req.query;
  if (!isbn) {
    return res.status(400).json({ error: 'ISBN is required' });
  }

  try {
    const book = await Book.findOne({ isbn });
    if (book) {
      return res.status(200).json({ exists: true, book });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error checking if book exists', details: error.message });
  }
}

