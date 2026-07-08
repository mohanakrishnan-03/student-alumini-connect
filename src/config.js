// Central API configuration
// In production, set REACT_APP_API_URL to your Railway backend URL in Vercel environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
