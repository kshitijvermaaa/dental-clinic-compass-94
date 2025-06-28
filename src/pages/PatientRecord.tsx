import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentHistory } from '@/components/patients/PaymentHistory';
import { LabWorkCard } from '@/components/labwork/LabWorkCard';
import { LabWorkForm } from '@/components/labwork/LabWorkForm';
import { LabWorkFilesDialog } from '@/components/labwork/LabWorkFilesDialog';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Stethoscope,
  Edit,
  Save,
  X,
  Plus,
  Activity,
  Clock,
  DollarSign,
  FlaskConical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLabWork } from '@/hooks/useLabWork';

interface Patient {
  id: string;
  patient_id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  mobile_number: string;
  email?: string;
  address: string;
  blood_group?: string;
  allergies?: string;
  chronic_conditions?: string;
  emergency_contact?: string;
  insurance_details?: string;
  referred_by?: string;
  patient_nickname?: string;
  created_at: string;
  updated_at: string;
  balance?: number;
}

interface Treatment {
  id: string;
  procedure_done: string;
  treatment_date: string;
  treatment_cost?: number;
  treatment_status: string;
  materials_used?: string;
  notes?: string;
  teeth_involved?: string[];
  next_appointment_date?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  notes?: string;
}

const PatientRecord = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getLabWorkByPatient } = useLabWork();
  
  const patientId = searchParams.get('patient');
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientLabWork, setPatientLabWork] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Partial<Patient>>({});
  const [showLabWorkForm, setShowLabWorkForm] = useState(false);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [selectedLabWorkId, setSelectedLabWorkId] = useState('');
  const [selectedLabWorkTitle, setSelectedLabWorkTitle] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (patientError) {
        console.error('Error fetching patient:', patientError);
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        });
        return;
      }

      setPatient(patientData);
      setEditedPatient(patientData);

      // Fetch treatments
      const { data: treatmentsData, error: treatmentsError } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', patientId)
        .order('treatment_date', { ascending: false });

      if (treatmentsError) {
        console.error('Error fetching treatments:', treatmentsError);
      } else {
        setTreatments(treatmentsData || []);
      }

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }

      // Fetch lab work
      try {
        const labWorkData = await getLabWorkByPatient(patientId);
        setPatientLabWork(labWorkData);
      } catch (error) {
        console.error('Error fetching lab work:', error);
      }

    } catch (error) {
      console.error('Error in fetchPatientData:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!patient || !editedPatient) return;

    try {
      const { error } = await supabase
        .from('patients')
        .update(editedPatient)
        .eq('patient_id', patientId);

      if (error) {
        console.error('Error updating patient:', error);
        toast({
          title: "Error",
          description: "Failed to update patient information",
          variant: "destructive",
        });
        return;
      }

      setPatient({ ...patient, ...editedPatient });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Patient information updated successfully",
      });
    } catch (error) {
      console.error('Error in handleSaveChanges:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleViewFiles = (labWorkId: string, labWorkTitle: string) => {
    setSelectedLabWorkId(labWorkId);
    setSelectedLabWorkTitle(labWorkTitle);
    setShowFilesDialog(true);
  };

  const handleEditLabWork = (labWork: any) => {
    // For now, we'll just show a toast. In a full implementation, 
    // you'd open an edit form with the lab work data pre-filled
    console.log('Edit lab work:', labWork);
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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <p className="text-xl text-slate-600">Patient not found</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/patient-search')}
          >
            Back to Search
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
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Patient Record
            </h1>
            <p className="text-slate-600">Complete medical record for {patient.full_name}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/in-patient-treatment?patient=${patient.patient_id}&name=${encodeURIComponent(patient.full_name)}`)}
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              New Treatment
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/patient-search')}
            >
              Back to Search
            </Button>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Patient Information
              </CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSaveChanges}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditedPatient(patient);
                    }}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-slate-600">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editedPatient.full_name || ''}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, full_name: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 font-semibold text-slate-900">{patient.full_name}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-600">Patient ID</Label>
                <p className="mt-1 font-mono text-slate-900">{patient.patient_id}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Age</Label>
                <p className="mt-1 text-slate-900">{calculateAge(patient.date_of_birth)} years</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Gender</Label>
                {isEditing ? (
                  <Input
                    value={editedPatient.gender || ''}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, gender: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-slate-900">{patient.gender}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Mobile Number</Label>
                {isEditing ? (
                  <Input
                    value={editedPatient.mobile_number || ''}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, mobile_number: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-slate-900 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {patient.mobile_number}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Email</Label>
                {isEditing ? (
                  <Input
                    value={editedPatient.email || ''}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-slate-900 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {patient.email || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-slate-600">Address</Label>
                {isEditing ? (
                  <Input
                    value={editedPatient.address || ''}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-slate-900 flex items-start gap-1">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    {patient.address}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Blood Group</Label>
                {isEditing ? (
                  <Input
                    value={editedPatient.blood_group || ''}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, blood_group: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-slate-900">{patient.blood_group || 'Not specified'}</p>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Allergies</Label>
                  {isEditing ? (
                    <Input
                      value={editedPatient.allergies || ''}
                      onChange={(e) => setEditedPatient(prev => ({ ...prev, allergies: e.target.value }))}
                      className="mt-1"
                      placeholder="Any known allergies"
                    />
                  ) : (
                    <p className="mt-1 text-slate-900">{patient.allergies || 'None reported'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">Chronic Conditions</Label>
                  {isEditing ? (
                    <Input
                      value={editedPatient.chronic_conditions || ''}
                      onChange={(e) => setEditedPatient(prev => ({ ...prev, chronic_conditions: e.target.value }))}
                      className="mt-1"
                      placeholder="Any chronic conditions"
                    />
                  ) : (
                    <p className="mt-1 text-slate-900">{patient.chronic_conditions || 'None reported'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">Emergency Contact</Label>
                  {isEditing ? (
                    <Input
                      value={editedPatient.emergency_contact || ''}
                      onChange={(e) => setEditedPatient(prev => ({ ...prev, emergency_contact: e.target.value }))}
                      className="mt-1"
                      placeholder="Emergency contact details"
                    />
                  ) : (
                    <p className="mt-1 text-slate-900">{patient.emergency_contact || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">Balance</Label>
                  <p className="mt-1 text-slate-900 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${patient.balance || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="treatments" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="lab-work">Lab Work</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="treatments" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Treatment History
                  </CardTitle>
                  <Button
                    onClick={() => navigate(`/in-patient-treatment?patient=${patient.patient_id}&name=${encodeURIComponent(patient.full_name)}`)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Treatment
                  </Button>
                </div>
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
                      <div key={treatment.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{treatment.procedure_done}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(treatment.treatment_status)}>
                              {treatment.treatment_status}
                            </Badge>
                            <span className="text-sm text-slate-500">{treatment.treatment_date}</span>
                          </div>
                        </div>
                        {treatment.materials_used && (
                          <p className="text-sm text-slate-600 mb-1">
                            <strong>Materials:</strong> {treatment.materials_used}
                          </p>
                        )}
                        {treatment.treatment_cost && (
                          <p className="text-sm text-slate-600 mb-1">
                            <strong>Cost:</strong> ${treatment.treatment_cost}
                          </p>
                        )}
                        {treatment.teeth_involved && treatment.teeth_involved.length > 0 && (
                          <p className="text-sm text-slate-600 mb-1">
                            <strong>Teeth:</strong> {treatment.teeth_involved.join(', ')}
                          </p>
                        )}
                        {treatment.notes && (
                          <p className="text-sm text-slate-600">
                            <strong>Notes:</strong> {treatment.notes}
                          </p>
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
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No appointments scheduled yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="font-semibold">
                              {appointment.appointment_date} at {appointment.appointment_time}
                            </span>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          <strong>Type:</strong> {appointment.appointment_type}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-slate-600 mt-1">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab-work" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-600" />
                    Lab Work Orders
                  </CardTitle>
                  <Button
                    onClick={() => setShowLabWorkForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Lab Work
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {patientLabWork.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FlaskConical className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No lab work orders yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientLabWork.map((labWork) => (
                      <LabWorkCard
                        key={labWork.id}
                        labWork={labWork}
                        onEdit={handleEditLabWork}
                        onViewFiles={(labWorkId) => handleViewFiles(labWorkId, `${labWork.lab_type} - ${patient.full_name}`)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentHistory patientId={patient.patient_id} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Patient Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Document management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lab Work Form Dialog */}
      <LabWorkForm 
        open={showLabWorkForm} 
        onOpenChange={setShowLabWorkForm}
        patientId={patient?.patient_id}
      />

      {/* Files Dialog */}
      <LabWorkFilesDialog
        open={showFilesDialog}
        onOpenChange={setShowFilesDialog}
        labWorkId={selectedLabWorkId}
        labWorkTitle={selectedLabWorkTitle}
      />
    </div>
  );
};

export default PatientRecord;