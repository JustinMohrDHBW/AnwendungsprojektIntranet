import React from 'react';
import { Link } from 'react-router-dom';

const departments = [
  {
    name: 'Management',
    description: 'Strategic leadership and company direction',
    icon: '👔',
    teamSize: 3,
    location: 'Hamburg',
    responsibilities: [
      'Company strategy and vision',
      'Business development',
      'Stakeholder relations',
      'Resource allocation'
    ]
  },
  {
    name: 'Software Development',
    description: 'Building innovative software solutions',
    icon: '💻',
    teamSize: 15,
    location: 'Hamburg & Berlin',
    responsibilities: [
      'Full-stack development',
      'Code review and quality assurance',
      'Technical architecture',
      'DevOps and deployment'
    ]
  },
  {
    name: 'Product',
    description: 'Product strategy and roadmap planning',
    icon: '🎯',
    teamSize: 4,
    location: 'Hamburg',
    responsibilities: [
      'Product roadmap',
      'User research',
      'Feature specification',
      'Market analysis'
    ]
  },
  {
    name: 'Marketing',
    description: 'Brand development and market presence',
    icon: '📢',
    teamSize: 3,
    location: 'Hamburg',
    responsibilities: [
      'Brand strategy',
      'Content marketing',
      'Social media',
      'Event management'
    ]
  },
  {
    name: 'UX Design',
    description: 'Creating exceptional user experiences',
    icon: '🎨',
    teamSize: 4,
    location: 'Berlin',
    responsibilities: [
      'User interface design',
      'User experience research',
      'Prototyping',
      'Design system maintenance'
    ]
  },
  {
    name: 'Sales',
    description: 'Building client relationships and driving growth',
    icon: '🤝',
    teamSize: 6,
    location: 'Berlin',
    responsibilities: [
      'Client acquisition',
      'Sales strategy',
      'Account management',
      'Partnership development'
    ]
  }
];

const DepartmentsOverview: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Departments</h1>
        <p className="text-xl text-gray-600">
          Discover how our teams work together to drive innovation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <Link 
            key={dept.name}
            to={`/departments/${dept.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="transform hover:scale-105 transition-transform"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{dept.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{dept.name}</h2>
                  <p className="text-sm text-gray-500">{dept.location}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{dept.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-600">Team size: {dept.teamSize}</span>
                <span className="text-gray-500">View details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsOverview; 