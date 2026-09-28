import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetailsPage from './pages/MedicineDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import InvoicePage from './pages/InvoicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import DeliveryAreasPage from './pages/DeliveryAreasPage';
import AboutContactPage from './pages/AboutContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/medicines/:id" element={<MedicineDetailsPage />} />
          <Route path="/delivery-areas" element={<DeliveryAreasPage />} />
          <Route path="/about-contact" element={<AboutContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Client Wholesale Shopping Protected Routes (Enforces Client Approval Status) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin', 'staff']} requireApproval={true}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin', 'staff']} requireApproval={true}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute>
                <InvoicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Control Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Staff Operational Portal */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default App;
