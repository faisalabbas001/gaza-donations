import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaBell, FaChevronDown } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import styles from './UserProfile.module.css';
import { CgProfile } from "react-icons/cg";

const UserProfile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {


    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="relative">
         
          {user?.isVerified && (
            <MdVerified className="absolute -top-1 -right-1 text-blue-500 bg-white rounded-full" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-1.5">
<CgProfile className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />            <p className="text-sm font-medium text-gray-700 text-wrap truncate max-w-[100px] sm:max-w-[120px] md:max-w-[160px]">
              {user?.name}
            </p>
           
          </div>
        </div>
       
      </button>

      {isDropdownOpen && (
        <div className={`${styles.profileDropdown} absolute right-[50%] translate-x-[40%] mt-5 w-80 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100`}>
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-lg">
                    {getInitials(user?.name)}
                    
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                  {user?.isVerified && (
                    <MdVerified className="inline ml-1 text-blue-500" />
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <p className="text-xs text-green-600 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaUser className="mr-3 text-gray-400" />
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaCog className="mr-3 text-gray-400" />
              Settings
            </Link>
            <Link
              to="/notifications"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FaBell className="mr-3 text-gray-400" />
              Notifications
            </Link>
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={onLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt className="mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;