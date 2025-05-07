import axios from 'axios';
import { toast } from 'sonner';
import { getToken } from './getToken';
// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://sku-lms.onrender.com';

  
  export const addBook = async (book) => {
    if (!book) {
      toast.error('Book is required');
      return;
    }
    try {
      const token = getToken();
      console.log('Token:', token);
      const response = await axios.post(`${BASE_URL}/book/addbook`, book, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Book added successfully');
      return response;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  }
  
  export const updateBook = async (book) => {
    if (!book.isbn) {
      toast.error('ISBN is required');
      return;
    }
    try {
      const token = getToken();
      const response = await axios.post(`${BASE_URL}/book/updatebook`, book, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Book updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

export const isBookExists = async (isbn) => {
    try {
        const response = await axios.get(`${BASE_URL}/book/isBookExists?isbn=${isbn}`);
        return response.data;
    } catch (error) {
        console.error('Error checking if book exists:', error);
        throw error;
    }
}


export const getBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/book/getbooks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}
export const searchBooks = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/book/searchbook`, {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const borrowBooks = async (studentId, issuedBy, bookIds, bookCopyCodes) => {
  try {
      const token = getToken();
      console.log('a',studentId,'bookid', bookIds,'bookcopy', bookCopyCodes,'issued', issuedBy);
      const response = await axios.post(`${BASE_URL}/loan/add-loan`, 
      { studentId: studentId, issuedBy: issuedBy, bookIds, bookCopyCodes: bookCopyCodes }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error borrowing books:', error);
      throw error;
  }
};


export const searchStudentById = async (studentId) => {
    try {
        const response = await axios.get(`${BASE_URL}/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};

export const fetchAllLoans = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/loan/all-loans?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (!Array.isArray(data.loans)) {
      throw new Error('Expected data.loans to be an array');
    }

    return { loans: data.loans, totalLoans: data.totalLoans };
  } catch (error) {
    console.error('Error fetching all loans:', error);
    throw error;
  }
};

  
export const unreturnedBooks1 = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/loan/unreturned-books`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unreturned books:', error);
        throw error;
    }
};

export const returnBook = async (loanId) => {
    try {
        const token = getToken();
        const response = await axios.post(`${BASE_URL}/loan/return-loan`, { loanId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error returning book:', error);
        throw error;
    }
}

export const fetchStudentLoans = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/loan/student/${studentId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (!Array.isArray(data.loans)) {
      throw new Error('Expected data.loans to be an array');
    }

    return data.loans;
  } catch (error) {
    console.error('Error fetching student loans:', error);
    throw error;
  }
};
