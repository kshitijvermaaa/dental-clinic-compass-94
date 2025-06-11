
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Calendar, FileText, Download, Edit, Heart, AlertCircle, Pill, Stethoscope, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePatients } from '@/hooks/usePatients';
import { PaymentHistory } from '@/components/patients/PaymentHistory';
import { supabase } from '@/integrations/supabase/client';

const PatientRecord = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  const { toast } = useToast();
  const { getPatientById } = usePatients();
  
  const [patient, setPatient] = useState<any>(null);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
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
      
      // Fetch patient details
      const patientData = await getPatientById(patientId);
      setPatient(patientData);
      
      // Fetch treatments
      const { data: treatmentData, error: treatmentError } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', patientId)
        .order('treatment_date', { ascending: false });

      if (treatmentError) {
        console.error('Error fetching treatments:', treatmentError);
      } else {
        setTreatments(treatmentData || []);
      }

      // Fetch prescriptions
      const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patientId)
        .order('prescribed_date', { ascending: false });

      if (prescriptionError) {
        console.error('Error fetching prescriptions:', prescriptionError);
      } else {
        setPrescriptions(prescriptionData || []);
      }

      // Fetch appointments
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });

      if (appointmentError) {
        console.error('Error fetching appointments:', appointmentError);
      } else {
        setAppointments(appointmentData || []);
      }
      
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

  const handleDownloadRecord = () => {
    toast({
      title: "Download Started",
      description: "Downloading complete patient record...",
    });
  };

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
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Patient Not Found</h2>
          <p className="text-slate-600">The requested patient record could not be found.</p>
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
            <p className="text-slate-600">Complete medical history and information</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadRecord}>
              <Download className="w-4 h-4 mr-2" />
              Download Record
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
          </div>
        </div>

        {/* Patient Overview Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {patient.full_name}
                    {patient.patient_nickname && <span className="text-lg text-slate-500 ml-2">"{patient.patient_nickname}"</span>}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Patient ID: {patient.patient_id} • {calculateAge(patient.date_of_birth)} years • {patient.gender}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-green-50 text-green-700 border-green-200">Active Patient</Badge>
                    {patient.blood_group && (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        <Heart className="w-3 h-3 mr-1" />
                        {patient.blood_group}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-slate-600">
                <div>Registered: {new Date(patient.created_at).toLocaleDateString()}</div>
                <div>Last Updated: {new Date(patient.updated_at).toLocaleDateString()}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>{patient.mobile_number}</span>
                    </div>
                    {patient.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Label className="font-medium text-slate-700">Address:</Label>
                      <p className="text-slate-600 mt-1">{patient.address}</p>
                    </div>
                    {patient.emergency_contact && (
                      <div className="pt-2">
                        <Label className="font-medium text-slate-700">Emergency Contact:</Label>
                        <p className="text-slate-600 mt-1">{patient.emergency_contact}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="font-medium text-slate-700">Allergies:</Label>
                      <p className="text-slate-600 mt-1">{patient.allergies || 'None reported'}</p>
                    </div>
                    <div>
                      <Label className="font-medium text-slate-700">Chronic Conditions:</Label>
                      <p className="text-slate-600 mt-1">{patient.chronic_conditions || 'None reported'}</p>
                    </div>
                    {patient.referred_by && (
                      <div>
                        <Label className="font-medium text-slate-700">Referred By:</Label>
                        <p className="text-slate-600 mt-1">{patient.referred_by}</p>
                      </div>
                    )}
                    {patient.insurance_details && (
                      <div>
                        <Label className="font-medium text-slate-700">Insurance:</Label>
                        <p className="text-slate-600 mt-1">{patient.insurance_details}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treatments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  Treatment History
                </CardTitle>
                <CardDescription>
                  {treatments.length} treatments recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {treatments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Stethoscope className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No treatments recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {treatments.map((treatment) => (
                      <div key={treatment.id} className="border rounded-lg p-4 hover:bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-100 text-blue-700">
                                {treatment.treatment_status}
                              </Badge>
                              <span className="text-sm text-slate-500">
                                {new Date(treatment.treatment_date).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-medium text-slate-900 mb-2">
                              {treatment.procedure_done}
                            </h4>
                            {treatment.teeth_involved && treatment.teeth_involved.length > 0 && (
                              <p className="text-sm text-slate-600 mb-2">
                                Teeth: {treatment.teeth_involved.join(', ')}
                              </p>
                            )}
                            {treatment.notes && (
                              <p className="text-sm text-slate-600">{treatment.notes}</p>
                            )}
                          </div>
                          {treatment.treatment_cost && (
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                ₹{treatment.treatment_cost.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  Prescription History
                </CardTitle>
                <CardDescription>
                  {prescriptions.length} prescriptions issued
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prescriptions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Pill className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No prescriptions issued yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-slate-900">
                            {prescription.medication_name}
                          </h4>
                          <span className="text-sm text-slate-500">
                            {new Date(prescription.prescribed_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="font-medium text-slate-700">Dosage:</Label>
                            <p className="text-slate-600">{prescription.dosage}</p>
                          </div>
                          <div>
                            <Label className="font-medium text-slate-700">Frequency:</Label>
                            <p className="text-slate-600">{prescription.frequency}</p>
                          </div>
                          <div>
                            <Label className="font-medium text-slate-700">Duration:</Label>
                            <p className="text-slate-600">{prescription.duration}</p>
                          </div>
                        </div>
                        {prescription.instructions && (
                          <div className="mt-2">
                            <Label className="font-medium text-slate-700">Instructions:</Label>
                            <p className="text-slate-600 text-sm">{prescription.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointment History
                </CardTitle>
                <CardDescription>
                  {appointments.length} appointments scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No appointments scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={
                              appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }>
                              {appointment.status}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {appointment.appointment_type}
                            </span>
                          </div>
                          <div className="font-medium text-slate-900">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-slate-600 mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentHistory patientId={patient.patient_id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientRecord;
