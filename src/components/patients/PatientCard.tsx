
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, User, Phone, Mail, Calendar, MapPin, Droplets } from 'lucide-react';
import html2canvas from 'html2canvas';

interface PatientCardProps {
  patient: {
    patient_id: string;
    full_name: string;
    mobile_number: string;
    email?: string;
    date_of_birth: string;
    gender: string;
    blood_group?: string;
    address: string;
    emergency_contact?: string;
  };
  clinicName?: string;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, clinicName = "Dental Clinic" }) => {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const downloadCard = async () => {
    const cardElement = document.getElementById('patient-card');
    if (cardElement) {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `patient-card-${patient.patient_id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Patient ID Card</h3>
        <Button onClick={downloadCard} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download Card
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Card 
          id="patient-card" 
          className="w-96 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-2xl"
        >
          <CardContent className="p-6 space-y-4">
            {/* Header */}
            <div className="text-center border-b border-blue-400 pb-4">
              <h2 className="text-xl font-bold text-white">{clinicName}</h2>
              <p className="text-blue-100 text-sm">Patient Identification Card</p>
            </div>

            {/* Patient Photo Placeholder & Basic Info */}
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center border-2 border-blue-300">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{patient.full_name}</h3>
                <p className="text-blue-100 text-sm">ID: {patient.patient_id}</p>
                <div className="flex items-center gap-4 text-sm text-blue-100 mt-1">
                  <span>{calculateAge(patient.date_of_birth)}Y</span>
                  <span>{patient.gender}</span>
                  {patient.blood_group && (
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      <span>{patient.blood_group}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-blue-100">
                <Phone className="w-3 h-3" />
                <span>{patient.mobile_number}</span>
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-blue-100">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{patient.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-blue-100">
                <Calendar className="w-3 h-3" />
                <span>DOB: {patient.date_of_birth}</span>
              </div>
              <div className="flex items-start gap-2 text-blue-100">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-tight">{patient.address}</span>
              </div>
            </div>

            {/* Emergency Contact */}
            {patient.emergency_contact && (
              <div className="border-t border-blue-400 pt-3">
                <p className="text-xs text-blue-200">Emergency Contact:</p>
                <p className="text-sm text-blue-100">{patient.emergency_contact}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-blue-400 pt-3 text-center">
              <p className="text-xs text-blue-200">
                Valid for medical treatments • Keep this card safe
              </p>
              <p className="text-xs text-blue-300 mt-1">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
