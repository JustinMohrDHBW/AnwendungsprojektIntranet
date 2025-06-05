import React, { useState, useEffect } from 'react';
import * as employeesApi from '../api/employees';
import type { Employee } from '../api/employees';

interface DepartmentNode {
  name: string;
  icon: string;
  teamSize?: number;
  children?: DepartmentNode[];
}

interface DepartmentModalProps {
  department: string;
  onClose: () => void;
  employees: Employee[];
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ department, onClose, employees }) => {
  const departmentEmployees = employees.filter(emp => emp.department === department);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{department} Team</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="divide-y">
          {departmentEmployees.map(employee => (
            <div key={employee.id} className="py-3">
              <div className="font-medium">{employee.firstName} {employee.lastName}</div>
              <div className="text-sm text-gray-600">{employee.personalnummer}</div>
              <div className="text-sm text-gray-600">{employee.phone}</div>
              <div className="text-sm text-gray-600">{employee.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrganizationalChart: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeesApi.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load employees:', error);
      }
    };
    loadEmployees();
  }, []);

  const departments: DepartmentNode = {
    name: 'Management',
    icon: '👔',
    teamSize: 1,
    children: [
      {
        name: 'Software Development',
        icon: '💻',
        teamSize: 3,
        children: []
      },
      {
        name: 'Product',
        icon: '🎯',
        children: [
          {
            name: 'UX Design',
            icon: '🎨',
            teamSize: 2
          }
        ]
      },
      {
        name: 'Marketing',
        icon: '📢',
        teamSize: 1
      },
      {
        name: 'Sales',
        icon: '🤝',
        teamSize: 1
      },
      {
        name: 'HR',
        icon: '👥',
        teamSize: 1
      },
      {
        name: 'Finance',
        icon: '💰',
        teamSize: 1
      }
    ]
  };

  const handleDepartmentClick = (name: string) => {
    setSelectedDepartment(name);
  };

  const renderDepartment = (dept: DepartmentNode, level: number = 0) => {
    return (
      <div
        key={dept.name}
        className={`
          flex flex-col items-center
          ${level === 0 ? 'mb-6' : 'mb-3'}
        `}
      >
        <div 
          onClick={() => handleDepartmentClick(dept.name)}
          className={`
            bg-white rounded-lg shadow-md p-3
            ${level === 0 ? 'bg-blue-50 border-blue-200' : ''}
            ${level === 1 ? 'bg-gray-50' : ''}
            min-w-[160px]
            transform transition-transform hover:scale-105
            text-center
            cursor-pointer
            hover:bg-gray-50
          `}
        >
          <div className="text-xl mb-1">{dept.icon}</div>
          <div className="font-semibold text-sm">{dept.name}</div>
          {dept.teamSize && (
            <div className="text-xs text-gray-600">
              {dept.teamSize} Team Member{dept.teamSize !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {dept.children && dept.children.length > 0 && (
          <>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="relative flex">
              <div className="absolute top-0 left-1/2 w-px h-4 -translate-x-1/2 bg-gray-300"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-300"></div>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {dept.children.map((child) => renderDepartment(child, level + 1))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Organization</h2>
      <p className="text-gray-600 mb-6">
        Our company structure is designed to promote collaboration and innovation across all departments.
        Click on any department to see team members.
      </p>
      <div className="flex justify-center overflow-x-auto pb-4">
        <div className="min-w-[300px] max-w-[1200px] w-full">
          {renderDepartment(departments)}
        </div>
      </div>

      {selectedDepartment && (
        <DepartmentModal
          department={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          employees={employees}
        />
      )}
    </div>
  );
};

export default OrganizationalChart; 