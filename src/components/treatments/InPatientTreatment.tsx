
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Stethoscope, Calendar as CalendarIcon, Save, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EnhancedTeethSelector } from '@/components/appointments/EnhancedTeethSelector';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

interface InPatientTreatmentProps {
  patientId: string;
  patientName: string;
  visitType: 'appointment' | 'first-visit' | 'emergency';
}

export const InPatientTreatment: React.FC<InPatientTreatmentProps> = ({ 
  patientId, 
  patientName, 
  visitType 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [treatmentData, setTreatmentData] = useState({
    procedure_done: '',
    materials_used: '',
    notes: '',
    treatment_cost: '',
    teeth_involved: [] as ToothSelection[],
    treatment_status: 'ongoing' as 'ongoing' | 'completed' | 'paused'
  });

  const [nextAppointmentDate, setNextAppointmentDate] = useState<Date>();
  const [documents, setDocuments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTreatmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setDocuments(Array.from(files));
    }
  };

  const uploadDocuments = async (treatmentId: string) => {
    if (documents.length === 0) return;

    try {
      for (const file of documents) {
        const fileName = `${treatmentId}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
          .from('treatment-documents')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Upload Warning",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Documents Uploaded",
        description: `${documents.length} document(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error in uploadDocuments:', error);
    }
  };

  const handleSaveTreatment = async () => {
    if (!patientId || !treatmentData.procedure_done) {
      toast({
        title: "Error",
        description: "Patient ID and procedure are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert ToothSelection[] to string[] for database storage
      const teethInvolvedStrings = treatmentData.teeth_involved.map(selection => 
        `${selection.tooth}:${selection.parts.join(',')}`
      );

      // Save treatment
      const { data: treatment, error: treatmentError } = await supabase
        .from('treatments')
        .insert({
          patient_id: patientId,
          procedure_done: treatmentData.procedure_done,
          materials_used: treatmentData.materials_used || null,
          notes: treatmentData.notes || null,
          treatment_cost: treatmentData.treatment_cost ? parseFloat(treatmentData.treatment_cost) : null,
          teeth_involved: teethInvolvedStrings.length > 0 ? teethInvolvedStrings : null,
          treatment_date: new Date().toISOString().split('T')[0],
          treatment_status: treatmentData.treatment_status,
          next_appointment_date: nextAppointmentDate ? format(nextAppointmentDate, 'yyyy-MM-dd') : null
        })
        .select()
        .single();

      if (treatmentError) {
        console.error('Treatment error:', treatmentError);
        throw treatmentError;
      }

      // Create next appointment if date is selected
      if (nextAppointmentDate && treatment) {
        const { error: appointmentError } = await supabase
          .from('appointments')
          .insert({
            patient_id: patientId,
            appointment_date: format(nextAppointmentDate, 'yyyy-MM-dd'),
            appointment_time: '10:00:00',
            appointment_type: 'followup',
            status: 'scheduled',
            notes: `Follow-up for: ${treatmentData.procedure_done}`
          });

        if (appointmentError) {
          console.error('Appointment error:', appointmentError);
          toast({
            title: "Warning",
            description: "Treatment saved but failed to create appointment",
            variant: "destructive",
          });
        }
      }

      // Upload documents
      if (treatment && documents.length > 0) {
        await uploadDocuments(treatment.id);
      }

      toast({
        title: "Success",
        description: "Treatment recorded successfully",
      });

      // Navigate back or to patient record
      navigate(`/patient-record?patient=${patientId}`);

    } catch (error) {
      console.error('Error saving treatment:', error);
      toast({
        title: "Error",
        description: "Failed to save treatment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              In-Patient Treatment
            </h1>
            <p className="text-slate-600 mt-1">
              Recording treatment for: <span className="font-semibold">{patientName || 'Unknown Patient'}</span>
              {visitType && <Badge className="ml-2">{visitType}</Badge>}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Treatment Details
            </CardTitle>
            <CardDescription>
              Record the treatment procedure and relevant information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="procedure">Procedure Done *</Label>
                <Input
                  id="procedure"
                  placeholder="e.g., Root Canal Treatment, Extraction, Cleaning"
                  value={treatmentData.procedure_done}
                  onChange={(e) => handleInputChange('procedure_done', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="cost">Treatment Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0.00"
                  value={treatmentData.treatment_cost}
                  onChange={(e) => handleInputChange('treatment_cost', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="materials">Materials Used</Label>
              <Input
                id="materials"
                placeholder="e.g., Amalgam, Composite, Local Anesthesia"
                value={treatmentData.materials_used}
                onChange={(e) => handleInputChange('materials_used', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Treatment Status</Label>
              <Select
                value={treatmentData.treatment_status}
                onValueChange={(value: 'ongoing' | 'completed' | 'paused') => 
                  handleInputChange('treatment_status', value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Teeth Involved</Label>
              <div className="mt-2">
                <EnhancedTeethSelector
                  selectedTeeth={treatmentData.teeth_involved}
                  onTeethChange={(teeth) => setTreatmentData(prev => ({ ...prev, teeth_involved: teeth }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Treatment Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the treatment..."
                value={treatmentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="documents">Upload Documents</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <Upload className="w-4 h-4 text-slate-400" />
              </div>
              {documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-slate-600">
                    {documents.length} file(s) selected: {documents.map(f => f.name).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label>Next Appointment Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextAppointmentDate ? format(nextAppointmentDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={nextAppointmentDate}
                    onSelect={setNextAppointmentDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSaveTreatment}
                disabled={isLoading || !treatmentData.procedure_done}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Treatment'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(`/patient-record?patient=${patientId}`)}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Patient Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
