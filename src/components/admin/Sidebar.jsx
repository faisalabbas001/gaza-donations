import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaHandHoldingHeart, 
  FaDonate, FaTags, FaChartBar, FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/families', icon: FaUsers, label: 'Families' },
    { path: '/admin/initiatives', icon: FaHandHoldingHeart, label: 'Initiatives' },
    { path: '/admin/donations', icon: FaDonate, label: 'Donations' },
    { path: '/admin/categories', icon: FaTags, label: 'Categories' },
    { path: '/admin/reports', icon: FaChartBar, label: 'Reports' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 z-30 lg:hidden
          ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white z-40 w-64
          transform transition-transform duration-300 ease-in-out
          border-r border-gray-200 flex flex-col
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center">
            <img 
              src="/adminlogo.png" 
              alt="GazaDonations" 
              className="h-8 w-8"
            />
            <span className="ml-2 text-lg font-semibold text-gray-800">
              GazaDonations
            </span>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`
                  flex items-center px-6 py-3
                  transition-colors duration-200
                  ${isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`text-lg ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile Section - Fixed at bottom */}
        <div className="mt-auto border-t border-gray-200">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <img
                src="/adminlogo.png"
                alt="Admin"
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@gazadonations.org</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={() => {
                // Add logout logic here
                onClose();
              }}
              className="
                mt-3 flex items-center text-red-500 hover:text-red-600
                transition-colors duration-200 text-sm w-full
              "
            >
              {/* <FaSignOutAlt className="mr-2" /> */}
              {/* <span>Logout</span> */}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;