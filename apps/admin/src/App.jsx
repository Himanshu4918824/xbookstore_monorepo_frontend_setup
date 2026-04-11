import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Layout & Auth Components ---
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; // Assuming we'll create this

// --- Page Components ---
import AdminDashboard from './pages/AdminDashboard';
import AdminCategoryManagementPage from './pages/AdminCategoryManagementPage';
import AdminBookManagementPage from './pages/AdminBookManagementPage';
import AdminBookFormPage from './pages/AdminBookFormPage';
import AdminAuthorManagementPage from './pages/AdminAuthorManagementPage';
import AdminAuthorCreatePage from './pages/AdminAuthorCreatePage';
import AdminAuthorEditPage from './pages/AdminAuthorEditPage';
import AdminPublicationManagementPage from './pages/AdminPublicationManagementPage';
import AdminPublicationFormPage from './pages/AdminPublicationFormPage';
import AdminReviewModerationPage from './pages/AdminReviewModerationPage';
import AdminCouponManagementPage from './pages/AdminCouponManagementPage';
import AdminCouponFormPage from './pages/AdminCouponFormPage';
import AdminFeaturedBooksPage from './pages/AdminFeaturedBooksPage';
import AdminBookOfTheMonthPage from './pages/AdminBookOfTheMonthPage';
import AdminBookOfTheYearPage from './pages/AdminBookOfTheYearPage';
import AdminAuthorOfTheMonthPage from './pages/AdminAuthorOfTheMonthPage';
import AdminAuthorOfTheYearPage from './pages/AdminAuthorOfTheYearPage';
import AdminBookFormatsPage from './pages/AdminBookFormatsPage';
import AdminStockManagementPage from './pages/AdminStockManagementPage';
// We also need Login and Auth providers for the admin app
import LoginPage from './pages/LoginPage'; // We need to copy this page too

function App() {
  return (
    <Routes>
      {/* Public route for Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Parent route for the entire protected admin section */}
      <Route
        path="/admin"
        element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}
      >
        {/* --- Main Dashboard --- */}
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* --- Content Management --- */}
        <Route path="categories" element={<AdminCategoryManagementPage />} />
        <Route path="books" element={<AdminBookManagementPage />} />
        <Route path="books/new" element={<AdminBookFormPage />} />
        <Route path="books/edit/:id" element={<AdminBookFormPage />} />
        <Route path="authors" element={<AdminAuthorManagementPage />} />
        <Route path="authors/create" element={<AdminAuthorCreatePage />} />
        <Route path="authors/edit/:id" element={<AdminAuthorEditPage />} />
        <Route path="books/:id/formats" element={<AdminBookFormatsPage />} />
        <Route path="publications" element={<AdminPublicationManagementPage />} />
        <Route path="publications/new" element={<AdminPublicationFormPage />} />
        <Route path="publications/edit/:id" element={<AdminPublicationFormPage />} />
        <Route path="/admin/stock" element={<AdminStockManagementPage />} />

        {/* --- Promotions Management --- */}
        <Route path="featured-books" element={<AdminFeaturedBooksPage />} />
        <Route path="book-of-the-month" element={<AdminBookOfTheMonthPage />} />
        <Route path="book-of-the-year" element={<AdminBookOfTheYearPage />} />
        <Route path="author-of-the-month" element={<AdminAuthorOfTheMonthPage />} />
        <Route path="author-of-the-year" element={<AdminAuthorOfTheYearPage />} />

        {/* --- Operations Management --- */}
        <Route path="reviews" element={<AdminReviewModerationPage />} />
        <Route path="coupons" element={<AdminCouponManagementPage />} />
        <Route path="coupons/new" element={<AdminCouponFormPage />} />
        <Route path="coupons/edit/:id" element={<AdminCouponFormPage />} />
      </Route>

      {/* A catch-all or redirect for the root path might be needed */}
      <Route path="/" element={<LoginPage />} />

    </Routes>
  );
}

export default App;