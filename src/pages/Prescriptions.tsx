
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, Plus, Eye, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';
import { PrescriptionViewer } from '@/components/prescriptions/PrescriptionViewer';

const prescriptionsData = [
  {
    id: 'RX001',
    patientName: 'John Doe',
    patientId: 'P001',
    date: '2024-06-08',
    medicines: ['Amoxicillin 500mg', 'Ibuprofen 400mg'],
    status: 'active',
    diagnosis: 'Dental Infection'
  },
  {
    id: 'RX002',
    patientName: 'Sarah Johnson',
    patientId: 'P024',
    date: '2024-06-07',
    medicines: ['Metronidazole 400mg', 'Paracetamol 650mg'],
    status: 'completed',
    diagnosis: 'Root Canal Treatment'
  },
  {
    id: 'RX003',
    patientName: 'Mike Wilson',
    patientId: 'P035',
    date: '2024-06-06',
    medicines: ['Chlorhexidine Mouthwash'],
    status: 'active',
    diagnosis: 'Gingivitis'
  }
];

const Prescriptions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showPrescriptionViewer, setShowPrescriptionViewer] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredPrescriptions = prescriptionsData.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionViewer(true);
  };

  const handleDownloadPrescription = (prescription: any) => {
    // Direct download functionality
    const content = `
DENTAL PRESCRIPTION

Clinic: DentalCare Pro Clinic
Date: ${prescription.date}
Prescription ID: ${prescription.id}

Patient Information:
Name: ${prescription.patientName}
Patient ID: ${prescription.patientId}

Diagnosis: ${prescription.diagnosis}

Prescribed Medications:
${prescription.medicines.map((med: string, index: number) => `${index + 1}. ${med}`).join('\n')}

Doctor: Dr. Smith
License: DL12345

---
This is a computer-generated prescription.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${prescription.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Prescriptions
            </h1>
            <p className="text-slate-600">Manage patient prescriptions and medicines</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button 
              onClick={() => setShowPrescriptionForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200 shadow-lg"
              title="Create New Prescription"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Prescription
            </Button>
          </div>
        </div>

        {/* Prescriptions List */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recent Prescriptions
            </CardTitle>
            <CardDescription>
              {filteredPrescriptions.length} prescriptions found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{prescription.patientName}</span>
                      <span className="text-sm text-slate-500">({prescription.patientId})</span>
                      <span className="text-sm font-mono text-slate-600">{prescription.id}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      <div>{prescription.diagnosis}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {prescription.medicines.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{prescription.date}</span>
                  <Badge className={`${getStatusColor(prescription.status)} border font-medium`}>
                    {prescription.status}
                  </Badge>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/patient-record?patient=${prescription.patientId}`)}
                      title="View Patient Record"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPrescription(prescription)}
                      title="View Prescription Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadPrescription(prescription)}
                      title="Download Prescription"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Prescription Form Dialog */}
      <PrescriptionForm 
        open={showPrescriptionForm} 
        onOpenChange={setShowPrescriptionForm} 
      />

      {/* Prescription Viewer Dialog */}
      <PrescriptionViewer
        open={showPrescriptionViewer}
        onOpenChange={setShowPrescriptionViewer}
        prescription={selectedPrescription}
      />
    </div>
  );
};

export default Prescriptions;
