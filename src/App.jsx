import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Categories from './pages/admin/Categories';
import Donations from './pages/admin/Donations';
import Families from './pages/admin/Families';
import Initiatives from './pages/admin/Initiatives';
import Reports from "./pages/admin/Reports"

import InitiativesUser from "./pages/InitiativesUser"

import Home from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast'
// Import pages
// import HomePage from './pages/HomePage';
import DonationPage from './pages/DonationPage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import ApplicationPage from './pages/ApplicationPage';
import UserDashboard from './pages/UserDashboard';
import ImpactFeedPage from './pages/ImpactFeedPage';
import InitiativeDetail from './pages/InitiativeDetail';
import FamilyApplicationPage from './pages/FamilyApplicationPage';
import InitiativeApplicationPage from './pages/InitiativeApplicationPage';

// Remove default create-react-app imports
// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
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
        <main className="flex-grow ">
          <Routes>
            {/* Public routes with header and footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<DonationPage />} />
              <Route path="/initiatives" element={<InitiativesUser/>}/>
              <Route path="/initiatives/:id" element={<InitiativeDetail />} />
              <Route path="/login" element={<LoginRegisterPage />} />
              <Route path="/apply" element={<ApplicationPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/impact" element={<ImpactFeedPage />} />
              <Route path="/apply/family" element={<FamilyApplicationPage />} />
              <Route path="/apply/initiative" element={<InitiativeApplicationPage />} />
            </Route>

            {/* Admin routes - completely separate layout */}
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
  );
}

export default App;