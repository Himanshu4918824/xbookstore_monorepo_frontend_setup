import 'react-phone-input-2/lib/style.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext.jsx'; // Import our new provider
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { ApiProvider } from './context/ApiProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Our ThemeContextProvider now wraps the app */}
      <AuthProvider> {/* <-- WRAP WITH AUTH PROVIDER */}
        <ApiProvider> {/* <-- WRAP WITH API PROVIDER */}
          <CartProvider>
            <ThemeContextProvider>
              {(theme) => (
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
                </ThemeProvider>
              )}
            </ThemeContextProvider>
          </CartProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);