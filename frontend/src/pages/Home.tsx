import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  const companyStats = [
    { label: 'Founded', value: '2021' },
    { label: 'Employees', value: '35' },
    { label: 'Locations', value: '2' },
    { label: 'Clients', value: '20+' }
  ];

  const locations = [
    {
      city: 'Hamburg',
      address: 'Speicherstadt - Am Sandtorkai 37',
      employees: 25,
      departments: ['Management', 'Software Development', 'Product', 'Marketing']
    },
    {
      city: 'Berlin',
      address: 'Factory Berlin - Rheinsberger Str. 76/77',
      employees: 10,
      departments: ['Software Development', 'UX Design', 'Sales']
    }
  ];

  const businessAreas = [
    {
      title: 'SaaS Platform',
      description: 'Modern cloud-based software solutions for small and medium businesses'
    },
    {
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications'
    },
    {
      title: 'Web Applications',
      description: 'Progressive web apps and responsive web solutions'
    },
    {
      title: 'API Integration',
      description: 'Custom API development and third-party integrations'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Company Logo and Welcome Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-blue-600 text-white text-4xl font-bold p-4 rounded-lg shadow-lg">
            <span className="mr-2">TV</span>
            <span className="text-2xl font-normal">TechVision</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to TechVision GmbH, {currentUser?.firstName}!
        </h1>
        <p className="text-xl text-gray-600">
          Innovating Tomorrow's Technology Today
        </p>
      </div>

      {/* Company Overview */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About TechVision GmbH</h2>
        <p className="text-gray-600 mb-6">
          Founded in 2021 in Hamburg, TechVision GmbH is an innovative technology startup that's rapidly making its mark in the German tech scene. 
          With a team of 35 talented professionals across two vibrant tech hubs, we specialize in developing modern SaaS solutions, 
          mobile applications, and web services. Our young and dynamic team combines fresh perspectives with technical expertise 
          to deliver cutting-edge solutions for our growing client base.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {companyStats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Business Areas */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">What We Do</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {businessAreas.map((area) => (
            <div key={area.title} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">{area.title}</h4>
              <p className="text-gray-600">{area.description}</p>
            </div>
          ))}
        </div>

        {/* Locations */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.city} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">{location.city}</h4>
              <p className="text-gray-600 mb-2">{location.address}</p>
              <p className="text-gray-600 mb-2">{location.employees} Employees</p>
              <div className="text-sm text-gray-500">
                {location.departments.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Link to="/departments" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 text-2xl mb-4">👥</div>
            <h2 className="text-xl font-semibold mb-2">Departments</h2>
            <p className="text-gray-600">
              Explore our company structure and team organization.
            </p>
          </div>
        </Link>

        <Link to="/intraconnect" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-purple-600 text-2xl mb-4">📇</div>
            <h2 className="text-xl font-semibold mb-2">Employee Directory</h2>
            <p className="text-gray-600">
              Connect with your colleagues and find contact information.
            </p>
          </div>
        </Link>

        <Link to="/files" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-green-600 text-2xl mb-4">📁</div>
            <h2 className="text-xl font-semibold mb-2">File Manager</h2>
            <p className="text-gray-600">
              Access and share important company documents and resources.
            </p>
          </div>
        </Link>

        <Link to="/blog" className="transform hover:scale-105 transition-transform">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-orange-600 text-2xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">Company Blog</h2>
            <p className="text-gray-600">
              Stay updated with the latest news and announcements.
            </p>
          </div>
        </Link>
      </div>

      {/* Company Values */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">Pushing boundaries and embracing new technologies to create better solutions.</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="text-lg font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-600">Working together across teams to achieve exceptional results.</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">Maintaining the highest standards in everything we do.</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-blue-600 font-semibold">Your Department</div>
            <div className="text-2xl">{currentUser?.abteilung || 'Not assigned'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-green-600 font-semibold">Employee ID</div>
            <div className="text-2xl">{currentUser?.personalnummer || '-'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-purple-600 font-semibold">Role</div>
            <div className="text-2xl">{currentUser?.role || 'User'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-orange-600 font-semibold">Last Login</div>
            <div className="text-2xl">{new Date().toLocaleDateString('de-DE')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 