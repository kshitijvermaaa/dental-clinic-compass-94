import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { VisualTeethSelector } from './VisualTeethSelector';
import { CalendarDays, Clock, User, Phone, FileText, Stethoscope } from 'lucide-react';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

interface EnhancedAppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedAppointmentForm: React.FC<EnhancedAppointmentFormProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [selectedTeeth, setSelectedTeeth] = useState<ToothSelection[]>([]);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    appointmentType: '',
    reason: '',
    symptoms: '',
    painLevel: '',
    urgency: '',
    notes: '',
    isFollowUp: false,
    previousTreatment: '',
    allergies: '',
    medications: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appointment Scheduled Successfully!",
      description: `New appointment for ${formData.patientName} has been scheduled for ${formData.date} at ${formData.time}.`,
    });
    onOpenChange(false);
    // Reset form
    setFormData({
      patientName: '', patientId: '', phone: '', email: '', date: '', time: '',
      appointmentType: '', reason: '', symptoms: '', painLevel: '', urgency: '',
      notes: '', isFollowUp: false, previousTreatment: '', allergies: '', medications: ''
    });
    setSelectedTeeth([]);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>
            Complete patient information and treatment details for the appointment.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name *</Label>
                <Input 
                  id="patient-name" 
                  placeholder="Enter full name"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input 
                  id="patient-id" 
                  placeholder="Auto-generated or existing ID"
                  value={formData.patientId}
                  onChange={(e) => handleInputChange('patientId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="patient@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Appointment Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Appointment Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Date *</Label>
                <Input 
                  id="appointment-date" 
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-time">Time *</Label>
                <Input 
                  id="appointment-time" 
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Treatment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Treatment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-type">Appointment Type *</Label>
                <Select value={formData.appointmentType} onValueChange={(value) => handleInputChange('appointmentType', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup">Routine Checkup</SelectItem>
                    <SelectItem value="cleaning">Teeth Cleaning</SelectItem>
                    <SelectItem value="filling">Dental Filling</SelectItem>
                    <SelectItem value="extraction">Tooth Extraction</SelectItem>
                    <SelectItem value="root-canal">Root Canal Treatment</SelectItem>
                    <SelectItem value="orthodontics">Orthodontic Treatment</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pain-level">Pain Level (1-10)</Label>
                <Select value={formData.painLevel} onValueChange={(value) => handleInputChange('painLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rate pain level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 10}, (_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString()}>
                        {i+1} {i === 0 ? '(No Pain)' : i === 9 ? '(Severe Pain)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Visual Teeth Selection */}
          <VisualTeethSelector selectedTeeth={selectedTeeth} onTeethChange={setSelectedTeeth} />

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Chief Complaint/Symptoms</Label>
                <Textarea 
                  id="symptoms" 
                  placeholder="Describe the main symptoms or concerns"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Detailed Reason for Visit</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Additional details about the appointment"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea 
                  id="allergies" 
                  placeholder="List any known allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea 
                  id="medications" 
                  placeholder="List current medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Follow-up and Additional Notes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="follow-up" 
                checked={formData.isFollowUp}
                onCheckedChange={(checked) => handleInputChange('isFollowUp', checked)}
              />
              <Label htmlFor="follow-up">This is a follow-up appointment</Label>
            </div>
            
            {formData.isFollowUp && (
              <div className="space-y-2">
                <Label htmlFor="previous-treatment">Previous Treatment Details</Label>
                <Textarea 
                  id="previous-treatment" 
                  placeholder="Describe previous treatment"
                  value={formData.previousTreatment}
                  onChange={(e) => handleInputChange('previousTreatment', e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Any additional information"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
              Schedule Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
