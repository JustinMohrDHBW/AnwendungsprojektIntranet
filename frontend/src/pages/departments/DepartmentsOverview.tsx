import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const DepartmentsOverview: React.FC = () => {
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
      </div>
    );
  }

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