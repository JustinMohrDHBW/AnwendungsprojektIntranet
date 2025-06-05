import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Intranet, {currentUser?.firstName}!
        </h1>
        <p className="text-xl text-gray-600">
          Your central hub for company resources and collaboration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* IntraConnect Card */}
        <Link to="/intraconnect" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 text-2xl mb-4">👥</div>
            <h2 className="text-xl font-semibold mb-2">Employee Directory</h2>
            <p className="text-gray-600">
              Connect with your colleagues and find contact information.
            </p>
          </div>
        </Link>

        {/* Files Card */}
        <Link to="/files" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-green-600 text-2xl mb-4">📁</div>
            <h2 className="text-xl font-semibold mb-2">File Manager</h2>
            <p className="text-gray-600">
              Access and share important company documents and resources.
            </p>
          </div>
        </Link>

        {/* Blog Card */}
        <Link to="/blog" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-purple-600 text-2xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">Company Blog</h2>
            <p className="text-gray-600">
              Stay updated with the latest news and announcements.
            </p>
          </div>
        </Link>
      </div>

      {currentUser?.role === 'ADMIN' && (
        <div className="mt-8">
          <Link to="/admin" className="transform hover:scale-105 transition-transform block">
            <div className="bg-purple-50 rounded-lg shadow-lg p-6">
              <div className="text-purple-600 text-2xl mb-4">⚙️</div>
              <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
              <p className="text-gray-600">
                Manage users and system settings.
              </p>
            </div>
          </Link>
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-blue-600 font-semibold">Your Department</div>
            <div className="text-2xl">{currentUser?.abteilung || 'Not assigned'}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-green-600 font-semibold">Employee ID</div>
            <div className="text-2xl">{currentUser?.personalnummer || '-'}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-purple-600 font-semibold">Role</div>
            <div className="text-2xl">{currentUser?.role || 'User'}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-orange-600 font-semibold">Last Login</div>
            <div className="text-2xl">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 