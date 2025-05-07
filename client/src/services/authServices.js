import axios from 'axios';

// const API_URL = "http://localhost:3000";
const API_URL = "https://sku-lms.onrender.com";

export const loginStudent = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/student`, { email, password });
    return response.data; // Should return the token and user details
  } catch (error) {
    throw new Error(error.response.data.message || 'Student login failed');
  }
};

export const login = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/login/${role}`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || `${role} login failed`);
  }
};


// Validate JWT for student
export const validateStudentToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/validate/vstudent`, { token });
    return response.data; // Should return validation status
  } catch (error) {
    throw new Error(error.response.data.message || 'Student token validation failed');
  }
};

// Validate JWT for admin


export const validateAdminToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/validate/vadmin`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return { isValid: true, role: response.data.role }; 
  } catch (error) {
    throw new Error(error.response.data.message || 'Admin token validation failed');
  }
};
