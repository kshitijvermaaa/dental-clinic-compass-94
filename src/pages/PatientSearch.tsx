
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, MapPin, Calendar, FileText, Eye } from 'lucide-react';

const mockPatients = [
  {
    id: 'P001',
    name: 'John Doe',
    age: 32,
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
    address: '123 Main Street, Mumbai',
    lastVisit: '2024-06-05',
    totalVisits: 8,
    status: 'Active',
    bloodGroup: 'O+',
    totalPaid: 15000,
    outstanding: 0
  },
  {
    id: 'P024',
    name: 'Sarah Johnson',
    age: 28,
    phone: '+91 87654 32109',
    email: 'sarah.j@example.com',
    address: '456 Oak Avenue, Delhi',
    lastVisit: '2024-06-08',
    totalVisits: 5,
    status: 'Active',
    bloodGroup: 'A+',
    totalPaid: 8500,
    outstanding: 1200
  },
  {
    id: 'P035',
    name: 'Mike Wilson',
    age: 45,
    phone: '+91 76543 21098',
    email: 'mike.wilson@example.com',
    address: '789 Pine Road, Bangalore',
    lastVisit: '2024-05-28',
    totalVisits: 12,
    status: 'Follow-up',
    bloodGroup: 'B+',
    totalPaid: 22000,
    outstanding: 0
  }
];

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredPatients(mockPatients);
    } else {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(term.toLowerCase()) ||
        patient.id.toLowerCase().includes(term.toLowerCase()) ||
        patient.phone.includes(term) ||
        patient.address.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Follow-up':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                Patient Search
              </h1>
            </div>
            <p className="text-slate-600">
              Search patients by name, ID, phone number, or address
            </p>
          </div>

          {/* Search Bar */}
          <Card className="bg-white border-slate-200 mb-8">
            <CardHeader>
              <CardTitle>Search Patients</CardTitle>
              <CardDescription>
                Enter patient name, ID, phone number, or address to search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, ID, phone, or address..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {filteredPatients.length} patient(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            ID: {patient.id} • Age: {patient.age} • Blood Group: {patient.bloodGroup}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{patient.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          Last visit: {patient.lastVisit}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Total Visits</p>
                        <p className="text-lg font-semibold text-slate-900">{patient.totalVisits}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Total Paid</p>
                        <p className="text-lg font-semibold text-green-600">₹{patient.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Outstanding</p>
                        <p className={`text-lg font-semibold ${patient.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{patient.outstanding.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        New Appointment
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Medical History
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPatients.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No patients found</h3>
                  <p className="text-slate-600">
                    Try adjusting your search terms or register a new patient
                  </p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Register New Patient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientSearch;
