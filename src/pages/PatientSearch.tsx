
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Calendar, FileText, Download, Eye, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PatientDetailsDialog } from '@/components/appointments/PatientDetailsDialog';
import { useToast } from '@/hooks/use-toast';

const patientsData = [
  {
    id: 'P001',
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john.doe@email.com',
    age: 35,
    gender: 'Male',
    lastVisit: '2024-06-01',
    totalVisits: 12,
    status: 'active'
  },
  {
    id: 'P024',
    name: 'Sarah Johnson',
    phone: '+91 9876543211',
    email: 'sarah.j@email.com',
    age: 28,
    gender: 'Female',
    lastVisit: '2024-06-05',
    totalVisits: 8,
    status: 'active'
  },
  {
    id: 'P035',
    name: 'Mike Wilson',
    phone: '+91 9876543212',
    email: 'mike.w@email.com',
    age: 42,
    gender: 'Male',
    lastVisit: '2024-05-28',
    totalVisits: 15,
    status: 'inactive'
  }
];

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('patient') || '');
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowPatientDetails(true);
  };

  const handleDownloadRecords = (patientName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading medical records for ${patientName}...`,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Patient Search
            </h1>
            <p className="text-slate-600">Find and manage patient records</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200 shadow-lg"
            onClick={() => navigate('/register')}
            title="Register New Patient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Patients
            </CardTitle>
            <CardDescription>
              Search by name, patient ID, phone number, or email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Enter patient name, ID, phone, or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 text-base h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Search Results
            </CardTitle>
            <CardDescription>
              {filteredPatients.length} patients {searchTerm ? 'found' : 'in database'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <User className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>{searchTerm ? 'No patients found matching your search.' : 'Start typing to search for patients.'}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/register')}
                >
                  Register New Patient
                </Button>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">{patient.name}</span>
                        <span className="text-sm text-slate-500">({patient.id})</span>
                        <Badge className={`${getStatusColor(patient.status)} border font-medium text-xs`}>
                          {patient.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </span>
                          <span>{patient.email}</span>
                          <span>{patient.age}Y {patient.gender}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Last visit: {patient.lastVisit} • {patient.totalVisits} total visits
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/appointments')}
                      title="View Patient Appointments"
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/prescriptions')}
                      title="View Patient Prescriptions"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPatient(patient.id)}
                      title="Quick View Patient Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/patient-record?patient=${patient.id}`)}
                      title="View Complete Patient Record"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadRecords(patient.name)}
                      title="Download Medical Records"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient Details Dialog */}
      <PatientDetailsDialog
        open={showPatientDetails}
        onOpenChange={setShowPatientDetails}
        patientId={selectedPatientId}
      />
    </div>
  );
};

export default PatientSearch;
