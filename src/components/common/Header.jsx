import React, { useState, useRef, useEffect } from 'react'; // Add useRef and useEffect
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from '../common/UserProfile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout } = useAuth(); // Add logout from useAuth
  const navigate = useNavigate(); // Add navigation hook
  const menuRef = useRef(null); // Add ref for the menu
  const buttonRef = useRef(null); // Add ref for the hamburger button

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout(); // Call logout from auth context
    navigate('/'); // Redirect to home page
    setIsMenuOpen(false); // Close mobile menu if open
  };

  // Navigation items based on auth status and role
  const getNavItems = () => {
    // Items shown to all users (logged in or not)
    const publicItems = [
      { to: '/initiatives', label: 'Initiatives' },
      { to: '/about', label: 'About' },
      { to: '/impact', label: 'Impact' },
    ];

    if (!auth.isAuthenticated) {
      return publicItems; // Only show public items when not logged in
    }

    if (auth.role === 'donor') {
      return [
        ...publicItems,
        { to: '/donate', label: 'Donate' }
      ];
    }

    if (auth.role === 'beneficiary') {
      return [
        ...publicItems,
        { to: '/apply', label: 'Apply' }
      ];
    }

    return publicItems;
  };

  const navItems = getNavItems();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              GazaDonations
            </Link>

            <nav className="hidden md:flex space-x-8 ml-10">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-primary-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!auth.isAuthenticated ? (
              <>
                <Link to="/register">
                  <Button variant="outline">Sign Up</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </>
            ) : (
              <>
                {/* {auth.role === 'donor' && (
                  <Link to="/donate">
                    <Button variant="violet" className="cursor-pointer">
                      Donate Now
                    </Button>
                  </Link>
                )} */}
                <UserProfile user={auth.user} onLogout={handleLogout} />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50"
        >
          {auth.isAuthenticated && (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {auth.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{auth.user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{auth.user?.email}</p>
                </div>
              </div>
            </div>
          )}
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
            
            {!auth.isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
            )}

            {/* Update mobile logout button to only show when authenticated */}
            {auth.isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            )}

            {auth.role === 'donor' && (
              <Link
                to="/donate"
                className="block px-3 py-2 rounded-md bg-primary-600 text-white"
              >
                Donate Now
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
