
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});


export const fetchManufacturers = async (params = {}) => {
  try {
    const response = await API.get('/api/manufacturers', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    throw new Error('Failed to fetch manufacturers');
  }
};


export const fetchCategories = async () => {
  try {
    const response = await API.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error('Failed to fetch categories');
  }
};

export default API;
