import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Phone, Mail, Calendar, FileText, Activity, Download, Edit, Stethoscope, CreditCard } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatients } from '@/hooks/usePatients';
import { useAppointments } from '@/hooks/useAppointments';
import { PatientCard } from '@/components/patients/PatientCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Treatment {
  id: string;
  treatment_date: string;
  procedure_done: string;
  notes?: string;
  treatment_status: string;
  treatment_cost?: number;
}

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribed_date: string;
}

const PatientRecord = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  const { toast } = useToast();
  
  const { getPatientById } = usePatients();
  const { appointments } = useAppointments();
  
  const [patient, setPatient] = useState<any>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    if (!patientId) return;
    
    try {
      setIsLoading(true);
      
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      const { data: treatmentsData } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', patientId)
        .order('treatment_date', { ascending: false });
      
      setTreatments(treatmentsData || []);

      const { data: prescriptionsData } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patientId)
        .order('prescribed_date', { ascending: false });
      
      setPrescriptions(prescriptionsData || []);

    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast({
        title: "Error",
        description: "Failed to load patient data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'ongoing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'paused':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const patientAppointments = appointments.filter(apt => apt.patient_id === patientId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading patient record...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Patient Not Found</h2>
          <p className="text-slate-500 mb-4">The requested patient record could not be found.</p>
          <Button onClick={() => navigate('/search')}>
            Back to Patient Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Patient Record
            </h1>
            <p className="text-slate-600">Complete medical history and treatment records</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate(`/in-patient-treatment?patient=${patientId}&name=${encodeURIComponent(patient.full_name)}&type=record`)}
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              New Treatment
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Record
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{patient.full_name}</div>
                {patient.patient_nickname && (
                  <div className="text-sm text-slate-500">"{patient.patient_nickname}"</div>
                )}
                <div className="text-sm text-slate-500">ID: {patient.patient_id}</div>
              </div>
              <Badge className="bg-green-50 text-green-700 border-green-200 border">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{patient.mobile_number}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-slate-500">Address:</span>
                    <p className="mt-1">{patient.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Personal Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Age:</span> {calculateAge(patient.date_of_birth)} years</div>
                  <div><span className="text-slate-500">Gender:</span> {patient.gender}</div>
                  <div><span className="text-slate-500">Date of Birth:</span> {patient.date_of_birth}</div>
                  {patient.blood_group && (
                    <div><span className="text-slate-500">Blood Group:</span> {patient.blood_group}</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Medical Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Allergies:</span>
                    <p className="mt-1">{patient.allergies || 'None reported'}</p>
                  </div>
                  {patient.chronic_conditions && (
                    <div>
                      <span className="text-slate-500">Chronic Conditions:</span>
                      <p className="mt-1">{patient.chronic_conditions}</p>
                    </div>
                  )}
                  {patient.emergency_contact && (
                    <div>
                      <span className="text-slate-500">Emergency Contact:</span>
                      <p className="mt-1">{patient.emergency_contact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Records */}
        <Tabs defaultValue="treatments" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="treatments">Treatments ({treatments.length})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments ({patientAppointments.length})</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions ({prescriptions.length})</TabsTrigger>
            <TabsTrigger value="idcard">ID Card</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="treatments" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Treatment History
                </CardTitle>
                <CardDescription>Complete record of all treatments</CardDescription>
              </CardHeader>
              <CardContent>
                {treatments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No treatments recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {treatments.map((treatment) => (
                      <div key={treatment.id} className="border border-slate-100 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-slate-900">{treatment.procedure_done}</div>
                            <div className="text-sm text-slate-500">{treatment.treatment_date}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {treatment.treatment_cost && (
                              <span className="text-sm font-medium">₹{treatment.treatment_cost}</span>
                            )}
                            <Badge className={`${getStatusColor(treatment.treatment_status)} border`}>
                              {treatment.treatment_status}
                            </Badge>
                          </div>
                        </div>
                        {treatment.notes && (
                          <p className="text-sm text-slate-600 mt-2">{treatment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointment History
                </CardTitle>
                <CardDescription>All scheduled and completed appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {patientAppointments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No appointments found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientAppointments.map((appointment) => (
                      <div key={appointment.id} className="border border-slate-100 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-slate-900">
                              {appointment.appointment_date} at {appointment.appointment_time}
                            </div>
                            <div className="text-sm text-slate-500">
                              Type: {appointment.appointment_type}
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-slate-600 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                          <Badge className={`${getStatusColor(appointment.status)} border`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Prescription History
                </CardTitle>
                <CardDescription>All prescribed medications</CardDescription>
              </CardHeader>
              <CardContent>
                {prescriptions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No prescriptions found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border border-slate-100 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-slate-900">{prescription.medication_name}</div>
                            <div className="text-sm text-slate-600">
                              {prescription.dosage} - {prescription.frequency} for {prescription.duration}
                            </div>
                            <div className="text-sm text-slate-500">Prescribed: {prescription.prescribed_date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="idcard" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Patient ID Card
                </CardTitle>
                <CardDescription>Digital ID card for the patient</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientCard patient={patient} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Documents & Reports
                </CardTitle>
                <CardDescription>Medical documents and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Document management will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientRecord;
