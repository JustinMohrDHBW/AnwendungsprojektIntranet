import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import Avatar from './Avatar';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, currentUser, logout } = useAuth();

  const getNameParts = () => {
    if (!currentUser?.username) return { firstName: '', lastName: '' };
    
    // Handle special case for admin
    if (currentUser.username === 'admin') {
      return { firstName: 'Justin', lastName: 'Mohr' };
    }

    const parts = currentUser.username.split('-');
    // Capitalize first letter of each part
    const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
    const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
    
    return { firstName, lastName };
  };

  const { firstName, lastName } = getNameParts();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">Intranet</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">
              IntraConnect
            </Link>
            <Link to="/blog" className="hover:bg-gray-700 px-3 py-2 rounded-md">
              Blog
            </Link>
            <Link to="/files" className="hover:bg-gray-700 px-3 py-2 rounded-md">
              Dateien
            </Link>
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Avatar 
                    firstName={firstName}
                    lastName={lastName}
                    size="sm"
                  />
                  <span className="text-gray-300">
                    {firstName} {lastName}
                    {currentUser?.role === 'admin' && (
                      <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded">Admin</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="hover:bg-gray-700 px-3 py-2 rounded-md text-red-300 hover:text-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-green-300 hover:text-green-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-gray-700"
          >
            IntraConnect
          </Link>
          <Link
            to="/blog"
            className="block px-3 py-2 rounded-md hover:bg-gray-700"
          >
            Blog
          </Link>
          <Link
            to="/files"
            className="block px-3 py-2 rounded-md hover:bg-gray-700"
          >
            Dateien
          </Link>
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-2 px-3 py-2">
                <Avatar 
                  firstName={firstName}
                  lastName={lastName}
                  size="sm"
                />
                <span className="text-gray-300">
                  {firstName} {lastName}
                  {currentUser?.role === 'admin' && (
                    <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded">Admin</span>
                  )}
                </span>
              </div>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 text-red-300 hover:text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 text-green-300 hover:text-green-200"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </nav>
  );
};

export default NavBar; 