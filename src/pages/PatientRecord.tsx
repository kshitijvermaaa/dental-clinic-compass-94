import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Phone, Mail, Calendar, Clock, FileText, Stethoscope, 
  Pill, ArrowLeft, Download, Edit, Plus, Eye
} from 'lucide-react';

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
  { value: 'occlusal', label: 'Occlusal (Top)' },
  { value: 'mesial', label: 'Mesial (Front)' },
  { value: 'distal', label: 'Distal (Back)' },
  { value: 'buccal', label: 'Buccal (Cheek side)' },
  { value: 'lingual', label: 'Lingual (Tongue side)' },
  { value: 'cervical', label: 'Cervical (Neck)' },
  { value: 'root', label: 'Root' },
  { value: 'full', label: 'Full Tooth' }
];

const PatientRecord = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Patient Not Found</h1>
            <p className="text-slate-600 mb-6">The patient record you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/search')}>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/search')}>
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
            <Button variant="outline" title="Download Records">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button title="Edit Patient Info">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  {patient.name}
                </CardTitle>
                <CardDescription>Patient ID: {patient.id}</CardDescription>
                <Badge className={`${getStatusColor(patient.status)} border font-medium text-xs w-fit`}>
                  {patient.status}
                </Badge>
              </div>
              <div className="text-right text-sm text-slate-600">
                <div className="font-medium">{patient.age} years • {patient.gender}</div>
                <div>Blood Group: {patient.bloodGroup}</div>
                <div>Total Visits: {patient.totalVisits}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  Contact Information
                </h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>{patient.phone}</div>
                  <div>{patient.email}</div>
                  <div className="text-xs">Emergency: {patient.emergencyContact}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Visit History
                </h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Last Visit: {patient.lastVisit}</div>
                  <div>Total Visits: {patient.totalVisits}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Address</h4>
                <div className="text-sm text-slate-600">
                  {patient.address}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Records */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger value="treatments" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Treatments
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Medical Info
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Appointment History</h3>
                  <Button size="sm" onClick={() => navigate('/appointments')}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
                {patient.appointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100">
                    <div className="space-y-1">
                      <div className="font-medium">{appointment.type}</div>
                      <div className="text-sm text-slate-600">{appointment.date} at {appointment.time}</div>
                    </div>
                    <Badge className={`${getStatusColor(appointment.status)} border font-medium text-xs`}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="prescriptions" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Prescription History</h3>
                  <Button size="sm" onClick={() => navigate('/prescriptions')}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Prescription
                  </Button>
                </div>
                {patient.prescriptions.map((prescription: any) => (
                  <div key={prescription.id} className="p-4 rounded-lg border border-slate-100 space-y-2">
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
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="treatments" className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Treatment History with Teeth Details</h3>
                {patient.treatments.map((treatment: any) => (
                  <div key={treatment.id} className="p-4 rounded-lg border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{treatment.type}</div>
                      <div className="text-sm text-slate-600">{treatment.date}</div>
                    </div>
                    {treatment.teeth.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-slate-700">Affected Teeth & Parts:</h5>
                        <div className="space-y-2">
                          {treatment.teeth.map((toothData: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded border">
                              <Badge variant="default" className="text-xs">
                                Tooth {toothData.tooth}
                              </Badge>
                              <div className="flex gap-1 flex-wrap">
                                {toothData.parts.map((part: string, partIndex: number) => (
                                  <Badge key={partIndex} variant="secondary" className="text-xs">
                                    {toothParts.find(p => p.value === part)?.label || part}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-sm text-slate-600">{treatment.notes}</div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="medical" className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Allergies</h4>
                    <p className="text-sm text-slate-600">{patient.allergies}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Medical History</h4>
                    <p className="text-sm text-slate-600">{patient.medicalHistory}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Blood Group</h4>
                    <p className="text-sm text-slate-600">{patient.bloodGroup}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Emergency Contact</h4>
                    <p className="text-sm text-slate-600">{patient.emergencyContact}</p>
                  </div>
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
