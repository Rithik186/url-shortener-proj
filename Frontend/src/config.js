// Configuration for the Frontend Application
// In development, it defaults to localhost:5000
// In production (e.g. Render), it uses the environment variable VITE_API_BASE_URL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export { API_BASE_URL };
