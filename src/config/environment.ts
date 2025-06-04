// Environment configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const config = {
  API_BASE_URL: isDevelopment 
    ? 'http://localhost:5208/api'
    : 'https://your-production-api-url.com/api', // Update this for production
  
  // Other environment-specific configs can go here
  isDevelopment,
  isProduction,
};
