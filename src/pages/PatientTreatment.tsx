
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PatientTreatmentSession } from '@/components/treatments/PatientTreatmentSession';
import { ArrowLeft, User, Stethoscope } from 'lucide-react';

// Mock patient data for getting basic info
const getPatientBasicInfo = (patientId: string) => {
  const patients: Record<string, any> = {
    'P001': { id: 'P001', name: 'John Doe' },
    'P024': { id: 'P024', name: 'Sarah Johnson' },
    'P035': { id: 'P035', name: 'Mike Wilson' }
  };
  return patients[patientId] || null;
};

const PatientTreatment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientId = searchParams.get('patient');
  const visitType = searchParams.get('type') as 'scheduled' | 'emergency' | 'first-visit' || 'scheduled';
  
  if (!patientId) {
    navigate('/search');
    return null;
  }

  const patient = getPatientBasicInfo(patientId);
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/search')} className="border-slate-300 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Patient Treatment Session
              </h1>
              <p className="text-slate-600">Record treatment details and clinical findings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/patient-record?patient=${patientId}`)}
              className="border-blue-300 hover:bg-blue-50 text-blue-700"
            >
              <User className="w-4 h-4 mr-2" />
              Patient Record
            </Button>
            <Button 
              onClick={() => navigate('/appointments')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Appointments
            </Button>
          </div>
        </div>

        {/* Treatment Session Component */}
        <PatientTreatmentSession
          patientId={patient.id}
          patientName={patient.name}
          visitType={visitType}
        />
      </div>
    </div>
  );
};

export default PatientTreatment;
