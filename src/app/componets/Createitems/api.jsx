// lib/api.js
import axios from 'axios';

export const addItem = async (formData) => {
  try {
    const response = await axios.post('http://localhost:3001/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data; // Return the data received from the backend
  } catch (error) {
    throw error; // Rethrow the error for handling in the component
  }
};
