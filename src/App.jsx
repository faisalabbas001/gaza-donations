import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Categories from './pages/admin/Categories';
import Donations from './pages/admin/Donations';
import Families from './pages/admin/Families';
import Initiatives from './pages/admin/Initiatives';
import Reports from './pages/admin/Reports';

import InitiativesUser from './pages/InitiativesUser';

import Home from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast';
// Import pages
// import HomePage from './pages/HomePage';
import DonationPage from './pages/DonationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicationPage from './pages/ApplicationPage';
import UserDashboard from './pages/UserDashboard';
import ImpactFeedPage from './pages/ImpactFeedPage';
import InitiativeDetail from './pages/InitiativeDetail';
import FamilyApplicationPage from './pages/FamilyApplicationPage';
import InitiativeApplicationPage from './pages/InitiativeApplicationPage';
import DonationRegister from './pages/DonorRegister'; // Add this import
import BeneficiaryRegister from './pages/BeneficiaryRegister'; // Add this import
import DonationLogin from './pages/DonorLogin'; // Add this import
import BeneficiaryLogin from './pages/BeneficiaryLogin'; // Add this import
import { AuthProvider } from './contexts/AuthContext';
import { DonorRoute, BeneficiaryRoute } from './components/layouts/ProtectedRoutes';
// Remove default create-react-app imports
// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#000',
                border: '1px solid #e5e7eb',
              },
            }}
          />
          <main className="flex-grow">
            <Routes>
              <Route element={<PublicLayout />}>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/initiatives" element={<InitiativesUser />} />
                <Route path="/initiatives/:id" element={<InitiativeDetail />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/donor" element={<DonationLogin />} />
                <Route path="/login/beneficiary" element={<BeneficiaryLogin />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register/donor" element={<DonationRegister />} />
                <Route path="/register/beneficiary" element={<BeneficiaryRegister />} />

                {/* Protected Donor routes */}
                <Route path="/donate" element={
                  <DonorRoute>
                    <DonationPage />
                  </DonorRoute>
                } />

                {/* Protected Beneficiary routes */}
                <Route path="/apply" element={
                  <BeneficiaryRoute>
                    <ApplicationPage />
                  </BeneficiaryRoute>
                } />
                <Route path="/apply/family" element={
                  <BeneficiaryRoute>
                    <FamilyApplicationPage />
                  </BeneficiaryRoute>
                } />
                <Route path="/apply/initiative" element={
                  <BeneficiaryRoute>
                    <InitiativeApplicationPage />
                  </BeneficiaryRoute>
                } />

                {/* Dashboard accessible by both */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/impact" element={<ImpactFeedPage />} />
              </Route>

              {/* Admin routes remain unchanged */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="families" element={<Families />} />
                <Route path="initiatives" element={<Initiatives />} />
                <Route path="donations" element={<Donations />} />
                <Route path="categories" element={<Categories />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
