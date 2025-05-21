import React from 'react';
import { FaHeart, FaGithub, FaQuestionCircle } from 'react-icons/fa';

const AdminFooter = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">
              © 2024 GazaDonations Admin Panel
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center text-gray-600 text-sm">
              <FaHeart className="text-red-500 mr-1" />
              Made with love for Palestine
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
              <FaQuestionCircle className="mr-1" />
              Help Center
            </button>
            <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
              <FaGithub className="mr-1" />
              Documentation
            </button>
            <select className="text-sm border rounded px-2 py-1">
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 