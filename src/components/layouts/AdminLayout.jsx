import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../admin/Sidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white z-20 px-4 h-16 flex items-center shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaBars className="text-xl text-gray-600" />
        </button>
        <span className="ml-3 text-lg font-semibold text-primary-600">
          GazaDonations
        </span>
      </header>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;