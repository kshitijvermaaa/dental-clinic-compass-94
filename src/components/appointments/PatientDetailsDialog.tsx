
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Calendar, FileText, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PatientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string | null;
}

// Mock patient data - in a real app, this would come from a database
const getPatientData = (patientId: string) => {
  const patients: Record<string, any> = {
    'P001': {
      id: 'P001',
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john.doe@email.com',
      age: 35,
      gender: 'Male',
      lastVisit: '2024-06-01',
      totalVisits: 12,
      status: 'active',
      bloodGroup: 'O+',
      allergies: 'None',
      medicalHistory: 'No significant medical history'
    },
    'P024': {
      id: 'P024',
      name: 'Sarah Johnson',
      phone: '+91 9876543211',
      email: 'sarah.j@email.com',
      age: 28,
      gender: 'Female',
      lastVisit: '2024-06-05',
      totalVisits: 8,
      status: 'active',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      medicalHistory: 'History of orthodontic treatment'
    },
    'P035': {
      id: 'P035',
      name: 'Mike Wilson',
      phone: '+91 9876543212',
      email: 'mike.w@email.com',
      age: 42,
      gender: 'Male',
      lastVisit: '2024-05-28',
      totalVisits: 15,
      status: 'inactive',
      bloodGroup: 'B+',
      allergies: 'None',
      medicalHistory: 'Previous root canal treatment'
    }
  };
  return patients[patientId] || null;
};

export const PatientDetailsDialog: React.FC<PatientDetailsDialogProps> = ({ open, onOpenChange, patientId }) => {
  const navigate = useNavigate();
  const patient = patientId ? getPatientData(patientId) : null;

  if (!patient) {
    return null;
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Patient Details
          </DialogTitle>
          <DialogDescription>
            Quick overview of patient information and medical history
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-slate-900">{patient.name}</h3>
              <p className="text-sm text-slate-600">Patient ID: {patient.id}</p>
              <Badge className={`${getStatusColor(patient.status)} border font-medium text-xs`}>
                {patient.status}
              </Badge>
            </div>
            <div className="text-right text-sm text-slate-600">
              <div>{patient.age} years • {patient.gender}</div>
              <div>Blood Group: {patient.bloodGroup}</div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{patient.email}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Visit History</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Last Visit: {patient.lastVisit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Total Visits: {patient.totalVisits}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medical Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Medical Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-700">Allergies:</span>
                <p className="text-slate-600 mt-1">{patient.allergies}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">Medical History:</span>
                <p className="text-slate-600 mt-1">{patient.medicalHistory}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                navigate(`/patient-record?patient=${patient.id}`);
              }}
              className="flex-1"
              title="View Complete Patient Record"
            >
              <Eye className="w-4 h-4 mr-2" />
              Full Record
            </Button>
            <Button 
              onClick={() => {
                onOpenChange(false);
                navigate('/prescriptions');
              }}
              className="flex-1"
              title="View/Create Prescriptions"
            >
              <FileText className="w-4 h-4 mr-2" />
              Prescriptions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
