import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as employeesApi from '../../api/employees';
import type { Employee } from '../../api/employees';

// Base department data without team sizes
const departmentBase = [
  {
    name: 'Management',
    description: 'Strategic leadership and company direction',
    icon: '👔',
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
    location: 'Berlin',
    responsibilities: [
      'Client acquisition',
      'Sales strategy',
      'Account management',
      'Partnership development'
    ]
  },
  {
    name: 'HR',
    description: 'Managing human resources and employee development',
    icon: '👥',
    location: 'Hamburg',
    responsibilities: [
      'Recruitment and onboarding',
      'Employee relations',
      'Training and development',
      'Benefits administration'
    ]
  },
  {
    name: 'Finance',
    description: 'Financial management and planning',
    icon: '💰',
    location: 'Hamburg',
    responsibilities: [
      'Financial planning',
      'Budgeting',
      'Accounting',
      'Risk management'
    ]
  },
  {
    name: 'Design',
    description: 'Creating visual and brand identity',
    icon: '🎨',
    location: 'Berlin',
    responsibilities: [
      'Brand design',
      'Visual design',
      'Graphic design',
      'Design systems'
    ]
  }
];

const DepartmentPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<(typeof departmentBase[0] & { teamSize: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await employeesApi.getEmployees();
        
        // Calculate team sizes for each department
        const departmentsWithSize = departmentBase.map(dept => {
          const teamSize = employees.filter(emp => {
            // Match both exact department names and variations (e.g., "Development" matches "Software Development")
            if (dept.name === 'Software Development') {
              return emp.department === 'Development' || emp.department === 'Software Development';
            }
            return emp.department === dept.name;
          }).length;
          
          return {
            ...dept,
            teamSize
          };
        });

        setDepartments(departmentsWithSize);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load department data');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/departments')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Departments
        </button>
      </div>
    );
  }

  // Find department by matching the URL parameter with the department name
  const department = departments.find(
    d => d.name.toLowerCase().replace(/\s+/g, '-') === departmentId
  );

  if (!department) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Department not found</p>
        <button
          onClick={() => navigate('/departments')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/departments"
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          ← Back to Departments
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <span className="text-4xl mr-4">{department.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
            <p className="text-gray-600">{department.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-2">Team Size</h2>
            <p className="text-2xl font-bold text-blue-600">{department.teamSize} members</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-2">Location</h2>
            <p className="text-2xl font-bold text-blue-600">{department.location}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
          <ul className="space-y-2">
            {department.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage; 