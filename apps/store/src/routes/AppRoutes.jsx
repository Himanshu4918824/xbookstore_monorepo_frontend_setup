import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all our page components
import HomePage from '../pages/HomePage';
import StorePage from '../pages/StorePage';
import AuthorsPage from '../pages/AuthorsPage';
import PublicationsPage from '../pages/PublicationsPage';
import ContactPage from '../pages/ContactPage';
import AboutPage from '../pages/AboutPage';
import BookDetailPage from '../pages/BookDetailPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import OrderHistoryPage from '../pages/dashboard/OrderHistoryPage';
import ProfilePage from '../pages/dashboard/ProfilePage'; // <-- IMPORT
import AddressBookPage from '../pages/dashboard/AddressBookPage'; // <-- IMPORT
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import AuthorDetailPage from '../pages/AuthorDetailPage';
import PublicationDetailPage from '../pages/PublicationDetailPage';
import AffiliateProgramPage from '../pages/affiliate/AffiliateProgramPage';
import AffiliateRegisterPage from '../pages/affiliate/AffiliateRegisterPage';
import AffiliateDashboardLayout from '../pages/affiliate/AffiliateDashboardLayout';
import AffiliateOverviewPage from '../pages/affiliate/AffiliateOverviewPage';
import AffiliateSalesPage from '../pages/affiliate/AffiliateSalesPage';
import AffiliateWalletPage from '../pages/affiliate/AffiliateWalletPage';
import SecurityPage from '../pages/dashboard/SecurityPage';
import OrderDetailsPage from '../pages/dashboard/OrderDetailsPage';
import TrackOrderPage from '../pages/dashboard/TrackOrderPage';
import InvoicePage from '../pages/dashboard/InvoicePage';
import NotFoundPage from '../pages/NotFoundPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PasswordResetPage from '../pages/PasswordResetPage';


function AppRoutes() {
  return (
    // The <Routes> component is a container for all our individual routes
    <Routes>
      {/* Each <Route> defines a path and the component to show for that path */}
      <Route path="/" element={<HomePage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} /> {/* <-- ADD */}
      <Route path="/login" element={<LoginPage />} /> {/* <-- ADD */}
      <Route path="/register" element={<RegisterPage />} /> {/* <-- ADD */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* <-- ADD */}
      {/* In a real app, this path would have unique tokens, e.g., /password-reset/:token */}
      <Route path="/password-reset/confirm/:uid/:token/" element={<PasswordResetPage />} />
      <Route path="/books/:bookId" element={<BookDetailPage />} />
      <Route path="/authors" element={<AuthorsPage />} />
      <Route path="/authors/:authorId" element={<AuthorDetailPage />} />
      <Route path="/publications" element={<PublicationsPage />} />
      <Route path="/publications/:publicationId" element={<PublicationDetailPage />} /> {/* <-- ADD */}
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Protected Routes */}
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> {/* <-- ADD */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      >
        {/* The "index" route is the default page for the parent path */}
        <Route index element={<OrderHistoryPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="orders/:orderId/track" element={<TrackOrderPage />} />
        <Route path="orders/:orderId/invoice" element={<InvoicePage />} />
        <Route path="profile" element={<ProfilePage />} /> {/* <-- ADD */}
        <Route path="security" element={<SecurityPage />} />
        <Route path="addresses" element={<AddressBookPage />} /> {/* <-- ADD */}
      </Route>



      <Route path="/affiliate" element={<AffiliateProgramPage />} /> {/* <-- ADD */}
      <Route path="/affiliate/register" element={<AffiliateRegisterPage />} /> {/* <-- ADD */}


      {/* Affiliate Protected Routes */}
      <Route
        path="/affiliate/dashboard"
        element={<ProtectedRoute><AffiliateDashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<AffiliateOverviewPage />} />
        <Route path="overview" element={<AffiliateOverviewPage />} />
        <Route path="sales" element={<AffiliateSalesPage />} />
        <Route path="wallet" element={<AffiliateWalletPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default AppRoutes;