import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Import departments data from the overview page
// In a real application, this would be in a separate data file
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

const DepartmentPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();

  const department = departments.find(
    dept => dept.name.toLowerCase().replace(/\s+/g, '-') === departmentId
  );

  if (!department) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Department not found</h1>
          <Link to="/departments" className="text-blue-600 hover:underline">
            Return to departments overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/departments')}
        className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
      >
        ← Back to Departments
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-8">
          <span className="text-6xl mr-6">{department.icon}</span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{department.name}</h1>
            <p className="text-xl text-gray-600">{department.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Info</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{department.location}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Team Size:</span>
                <span className="font-medium">{department.teamSize} members</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
            <ul className="space-y-2">
              {department.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-600">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Structure</h2>
          <div className="prose max-w-none text-gray-600">
            <p>
              The {department.name} team consists of {department.teamSize} dedicated professionals 
              working from our {department.location} {department.location.includes('&') ? 'offices' : 'office'}. 
              Our team structure is designed to promote collaboration, innovation, and efficient delivery 
              of results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage; 