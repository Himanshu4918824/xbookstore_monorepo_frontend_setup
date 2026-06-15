import api from './axiosConfig'; // Import our pre-configured axios instance

// This function takes the user data from the registration form
const registerUser = (userData) => {
  // It makes a POST request to your backend's registration endpoint
  // NOTE: Your backend URL for registration is '/auth/registration/'
  // Our api instance automatically adds the base URL, so we just need the specific path.
  return api.post('/api/auth/registration/', userData);
};

// --- NEW FUNCTION ---
// This function takes the user's credentials
const loginUser = (credentials) => {
  // It makes a POST request to your backend's login endpoint
  // NOTE: The default dj-rest-auth login URL is '/auth/login/'
  return api.post('/api/auth/login/', credentials);
};
// --- END OF NEW FUNCTION ---

// --- NEW FUNCTION 1 ---
const requestPasswordReset = (email) => {
  // Sends the email to the backend's reset endpoint
  return api.post('/api/auth/password/reset/', { email });
};

// --- NEW FUNCTION 2 ---
const confirmPasswordReset = (data) => {
  // Sends the new passwords and tokens to the confirmation endpoint
  return api.post('/api/auth/password/reset/confirm/', data);
};
// --- END OF NEW FUNCTIONS ---

// We export both functions now
export { registerUser, loginUser, requestPasswordReset, confirmPasswordReset };