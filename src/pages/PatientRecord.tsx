import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Phone, Mail, Calendar, Clock, FileText, Stethoscope, 
  Pill, ArrowLeft, Download, Edit, Plus, Eye, Heart, AlertTriangle
} from 'lucide-react';
import { PatientCard } from '@/components/patients/PatientCard';
import { useSettings } from '@/contexts/SettingsContext';

// Mock patient data - enhanced with teeth treatment data
const getPatientRecord = (patientId: string) => {
  const records: Record<string, any> = {
    'P001': {
      id: 'P001',
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john.doe@email.com',
      age: 35,
      gender: 'Male',
      bloodGroup: 'O+',
      address: '123 Main Street, Mumbai, Maharashtra',
      emergencyContact: '+91 9876543211',
      lastVisit: '2024-06-01',
      totalVisits: 12,
      status: 'active',
      allergies: 'None',
      medicalHistory: 'No significant medical history',
      appointments: [
        { id: 'A001', date: '2024-06-08', time: '09:00 AM', type: 'Routine Checkup', status: 'scheduled' },
        { id: 'A000', date: '2024-06-01', time: '02:00 PM', type: 'Cleaning', status: 'completed' }
      ],
      prescriptions: [
        { id: 'RX001', date: '2024-06-01', diagnosis: 'Dental Infection', medicines: ['Amoxicillin 500mg', 'Ibuprofen 400mg'] }
      ],
      treatments: [
        { 
          id: 'T001', 
          date: '2024-06-01', 
          type: 'Cleaning', 
          teeth: [
            { tooth: '16', parts: ['occlusal', 'buccal'] },
            { tooth: '17', parts: ['full'] }
          ], 
          notes: 'Routine cleaning completed' 
        },
        { 
          id: 'T002', 
          date: '2024-05-15', 
          type: 'Filling', 
          teeth: [
            { tooth: '26', parts: ['occlusal'] }
          ], 
          notes: 'Composite filling placed on occlusal surface' 
        }
      ]
    },
    'P024': {
      id: 'P024',
      name: 'Sarah Johnson',
      phone: '+91 9876543211',
      email: 'sarah.j@email.com',
      age: 28,
      gender: 'Female',
      bloodGroup: 'A+',
      address: '456 Oak Avenue, Delhi, Delhi',
      emergencyContact: '+91 9876543212',
      lastVisit: '2024-06-05',
      totalVisits: 8,
      status: 'active',
      allergies: 'Penicillin',
      medicalHistory: 'History of orthodontic treatment',
      appointments: [
        { id: 'A002', date: '2024-06-07', time: '10:30 AM', type: 'Root Canal Follow-up', status: 'completed' }
      ],
      prescriptions: [
        { id: 'RX002', date: '2024-06-07', diagnosis: 'Root Canal Treatment', medicines: ['Metronidazole 400mg', 'Paracetamol 650mg'] }
      ],
      treatments: [
        { 
          id: 'T003', 
          date: '2024-06-07', 
          type: 'Root Canal', 
          teeth: [
            { tooth: '36', parts: ['root', 'cervical'] }
          ], 
          notes: 'Root canal treatment completed' 
        }
      ]
    },
    'P035': {
      id: 'P035',
      name: 'Mike Wilson',
      phone: '+91 9876543212',
      email: 'mike.w@email.com',
      age: 42,
      gender: 'Male',
      bloodGroup: 'B+',
      address: '789 Pine Street, Bangalore, Karnataka',
      emergencyContact: '+91 9876543213',
      lastVisit: '2024-05-28',
      totalVisits: 15,
      status: 'inactive',
      allergies: 'None',
      medicalHistory: 'Previous root canal treatment',
      appointments: [
        { id: 'A003', date: '2024-06-06', time: '02:00 PM', type: 'Teeth Cleaning', status: 'completed' }
      ],
      prescriptions: [
        { id: 'RX003', date: '2024-06-06', diagnosis: 'Gingivitis', medicines: ['Chlorhexidine Mouthwash'] }
      ],
      treatments: [
        { 
          id: 'T004', 
          date: '2024-06-06', 
          type: 'Cleaning', 
          teeth: [], 
          notes: 'Scaling and polishing completed' 
        }
      ]
    }
  };
  return records[patientId] || null;
};

const toothParts = [
  { value: 'occlusal', label: 'Occlusal', color: '#ef4444', shortLabel: 'O' },
  { value: 'mesial', label: 'Mesial', color: '#3b82f6', shortLabel: 'M' },
  { value: 'distal', label: 'Distal', color: '#10b981', shortLabel: 'D' },
  { value: 'buccal', label: 'Buccal', color: '#f59e0b', shortLabel: 'B' },
  { value: 'lingual', label: 'Lingual', color: '#8b5cf6', shortLabel: 'L' },
  { value: 'cervical', label: 'Cervical', color: '#06b6d4', shortLabel: 'C' },
  { value: 'root', label: 'Root', color: '#84cc16', shortLabel: 'R' },
  { value: 'full', label: 'Full Tooth', color: '#dc2626', shortLabel: 'F' }
];

const PatientRecord = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clinicName } = useSettings();
  const patientId = searchParams.get('patient');
  
  if (!patientId) {
    navigate('/search');
    return null;
  }

  const patient = getPatientRecord(patientId);
  
  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Patient Not Found</h1>
            <p className="text-slate-600 mb-6">The patient record you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/search')} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Enhanced teeth visualization component
  const TeethVisualization = ({ treatments }: { treatments: any[] }) => {
    const allTreatedTeeth = treatments.flatMap(t => t.teeth);
    const uniqueTeeth = Array.from(new Set(allTreatedTeeth.map(t => t.tooth)))
      .map(tooth => ({
        tooth,
        parts: Array.from(new Set(allTreatedTeeth.filter(t => t.tooth === tooth).flatMap(t => t.parts)))
      }));

    if (uniqueTeeth.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>No teeth treatments recorded yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          Treatment Overview Map
        </h5>
        <div className="grid gap-3">
          {uniqueTeeth.map((toothData, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-white rounded-lg border-2 border-blue-200 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-700">{toothData.tooth}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700 mb-1">Tooth {toothData.tooth}</div>
                <div className="flex flex-wrap gap-1">
                  {toothData.parts.map((part: string, partIndex: number) => (
                    <Badge 
                      key={partIndex} 
                      className="text-xs text-white border-0"
                      style={{ 
                        backgroundColor: toothParts.find(p => p.value === part)?.color || '#dc2626' 
                      }}
                    >
                      {toothParts.find(p => p.value === part)?.label || part}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/search')} className="border-slate-300 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Patient Record
              </h1>
              <p className="text-slate-600">Complete medical history and treatment records</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/treatment-flow?patient=${patientId}`)}
              className="border-green-300 hover:bg-green-50 text-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Treatment
            </Button>
            <Button variant="outline" title="Download Records" className="border-slate-300 hover:bg-slate-50">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button title="Edit Patient Info" className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  {patient.name}
                </CardTitle>
                <CardDescription className="text-blue-100">Patient ID: {patient.id}</CardDescription>
                <Badge className={`${getStatusColor(patient.status)} border font-medium text-xs w-fit`}>
                  {patient.status}
                </Badge>
              </div>
              <div className="text-right text-sm text-blue-100">
                <div className="font-medium text-white">{patient.age} years • {patient.gender}</div>
                <div>Blood Group: {patient.bloodGroup}</div>
                <div>Total Visits: {patient.totalVisits}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  Contact Information
                </h4>
                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    {patient.email}
                  </div>
                  <div className="text-xs text-slate-500">
                    Emergency: {patient.emergencyContact}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Visit History
                </h4>
                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Last Visit: {patient.lastVisit}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Total Visits: {patient.totalVisits}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Address</h4>
                <div className="text-sm text-slate-600">
                  {patient.address}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient ID Card */}
        <PatientCard 
          patient={{
            id: patient.id,
            name: patient.name,
            phone: patient.phone,
            email: patient.email,
            age: patient.age,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            address: patient.address,
            dateOfBirth: patient.dateOfBirth || '1990-01-01',
            emergencyContact: patient.emergencyContact
          }}
          clinicName={clinicName}
        />

        {/* Detailed Records */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="treatments" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-slate-50">
                <TabsTrigger value="treatments" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Stethoscope className="w-4 h-4" />
                  Treatments
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Calendar className="w-4 h-4" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Pill className="w-4 h-4" />
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <FileText className="w-4 h-4" />
                  Medical Info
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="treatments" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Treatment History with Teeth Details</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {patient.treatments.length} treatments
                  </Badge>
                </div>
                
                {/* Teeth Visualization */}
                <TeethVisualization treatments={patient.treatments} />
                
                <Separator />
                
                {/* Treatment Details */}
                <div className="space-y-4">
                  {patient.treatments.map((treatment: any) => (
                    <Card key={treatment.id} className="border border-slate-200 shadow-sm">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{treatment.type}</h4>
                              <p className="text-sm text-slate-600">{treatment.date}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Completed</Badge>
                        </div>
                        
                        {treatment.teeth.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-slate-700">Affected Teeth & Parts:</h5>
                            <div className="grid gap-2">
                              {treatment.teeth.map((toothData: any, index: number) => (
                                <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded border">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-blue-700">{toothData.tooth}</span>
                                  </div>
                                  <div className="flex gap-1 flex-wrap">
                                    {toothData.parts.map((part: string, partIndex: number) => (
                                      <Badge 
                                        key={partIndex} 
                                        className="text-xs text-white border-0"
                                        style={{ 
                                          backgroundColor: toothParts.find(p => p.value === part)?.color || '#dc2626' 
                                        }}
                                      >
                                        {toothParts.find(p => p.value === part)?.shortLabel || part}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                          <strong>Notes:</strong> {treatment.notes}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="appointments" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Appointment History</h3>
                  <Button size="sm" onClick={() => navigate('/appointments')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
                {patient.appointments.map((appointment: any) => (
                  <Card key={appointment.id} className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{appointment.type}</div>
                          <div className="text-sm text-slate-600">{appointment.date} at {appointment.time}</div>
                        </div>
                        <Badge className={`${getStatusColor(appointment.status)} border font-medium text-xs`}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="prescriptions" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Prescription History</h3>
                  <Button size="sm" onClick={() => navigate('/prescriptions')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Prescription
                  </Button>
                </div>
                {patient.prescriptions.map((prescription: any) => (
                  <Card key={prescription.id} className="border border-slate-200">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{prescription.diagnosis}</div>
                        <div className="text-sm text-slate-600">{prescription.date}</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        <div className="font-medium">Medicines:</div>
                        <ul className="list-disc list-inside">
                          {prescription.medicines.map((medicine: string, index: number) => (
                            <li key={index}>{medicine}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="medical" className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-orange-200 bg-orange-50">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        Allergies
                      </h4>
                      <p className="text-sm text-slate-600">{patient.allergies}</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium text-slate-900 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-blue-600" />
                        Medical History
                      </h4>
                      <p className="text-sm text-slate-600">{patient.medicalHistory}</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-red-200 bg-red-50">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium text-slate-900">Blood Group</h4>
                      <p className="text-sm text-slate-600">{patient.bloodGroup}</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-green-200 bg-green-50">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium text-slate-900">Emergency Contact</h4>
                      <p className="text-sm text-slate-600">{patient.emergencyContact}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientRecord;
