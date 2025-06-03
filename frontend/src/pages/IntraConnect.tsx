import React, { useState, useMemo } from 'react';

interface Employee {
  id: number;
  personalnummer: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

const IntraConnect: React.FC = () => {
  // Search states
  const [searchPersonalnummer, setSearchPersonalnummer] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchName, setSearchName] = useState('');

  // This would typically come from an API
  const employees: Employee[] = [
    {
      id: 1,
      personalnummer: "EMP001",
      name: "John Doe",
      position: "Software Engineer",
      department: "Engineering",
      email: "john.doe@company.com",
      phone: "+49 123 456789"
    },
    {
      id: 2,
      personalnummer: "EMP002",
      name: "Jane Smith",
      position: "Product Manager",
      department: "Product",
      email: "jane.smith@company.com",
      phone: "+49 123 456790"
    },
    {
      id: 3,
      personalnummer: "EMP003",
      name: "Max Mustermann",
      position: "Marketing Specialist",
      department: "Marketing",
      email: "max.mustermann@company.com",
      phone: "+49 123 456791"
    }
  ];

  // Get unique departments for the dropdown
  const departments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department))];
  }, [employees]);

  // Filter employees based on search criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchPersonalnummer = employee.personalnummer.toLowerCase()
        .includes(searchPersonalnummer.toLowerCase());
      const matchDepartment = searchDepartment === '' || 
        employee.department === searchDepartment;
      const matchName = employee.name.toLowerCase()
        .includes(searchName.toLowerCase());

      return matchPersonalnummer && matchDepartment && matchName;
    });
  }, [employees, searchPersonalnummer, searchDepartment, searchName]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Directory</h1>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="personalnummer" className="block text-sm font-medium text-gray-700 mb-2">
              Personalnummer
            </label>
            <input
              type="text"
              id="personalnummer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchPersonalnummer}
              onChange={(e) => setSearchPersonalnummer(e.target.value)}
              placeholder="z.B. EMP001"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Abteilung
            </label>
            <select
              id="department"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
            >
              <option value="">Alle Abteilungen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Name eingeben"
            />
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {filteredEmployees.length} Mitarbeiter gefunden
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div 
            key={employee.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{employee.name}</h2>
                <p className="text-gray-600">{employee.position}</p>
                <p className="text-sm text-gray-500">#{employee.personalnummer}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Abteilung:</span> {employee.department}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline">
                  {employee.email}
                </a>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Telefon:</span>{' '}
                <a href={`tel:${employee.phone}`} className="text-blue-600 hover:underline">
                  {employee.phone}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Keine Mitarbeiter gefunden. Bitte ändern Sie Ihre Suchkriterien.
          </p>
        </div>
      )}
    </div>
  );
};

export default IntraConnect; 