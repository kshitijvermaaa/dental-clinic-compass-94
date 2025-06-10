
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { VisualTeethSelector } from '@/components/appointments/VisualTeethSelector';
import { UserCheck, Stethoscope, FileText, Calendar, Clock, TestTube, AlertTriangle, Save } from 'lucide-react';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

interface InPatientTreatmentProps {
  patientId?: string;
  patientName?: string;
  visitType?: 'appointment' | 'first-visit' | 'emergency';
}

export const InPatientTreatment: React.FC<InPatientTreatmentProps> = ({
  patientId = '',
  patientName = '',
  visitType = 'appointment'
}) => {
  const { toast } = useToast();
  const [selectedTeeth, setSelectedTeeth] = useState<ToothSelection[]>([]);
  const [treatmentData, setTreatmentData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    chiefComplaint: '',
    clinicalFindings: '',
    diagnosis: '',
    treatmentPerformed: '',
    medicationsPrescribed: '',
    testsRecommended: '',
    followUpInstructions: '',
    nextAppointmentRequired: false,
    nextAppointmentDate: '',
    nextAppointmentTime: '',
    nextAppointmentPurpose: '',
    painLevel: '',
    treatmentStatus: 'in-progress'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setTreatmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTreatment = () => {
    const treatmentRecord = {
      ...treatmentData,
      patientId,
      teethTreated: selectedTeeth,
      createdAt: new Date().toISOString()
    };

    console.log('Saving treatment record:', treatmentRecord);
    
    toast({
      title: "Treatment Record Saved! ✅",
      description: `Treatment details for ${patientName} have been successfully recorded.`,
    });

    // Reset form
    setTreatmentData({
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
      chiefComplaint: '',
      clinicalFindings: '',
      diagnosis: '',
      treatmentPerformed: '',
      medicationsPrescribed: '',
      testsRecommended: '',
      followUpInstructions: '',
      nextAppointmentRequired: false,
      nextAppointmentDate: '',
      nextAppointmentTime: '',
      nextAppointmentPurpose: '',
      painLevel: '',
      treatmentStatus: 'in-progress'
    });
    setSelectedTeeth([]);
  };

  const getVisitTypeInfo = () => {
    switch (visitType) {
      case 'first-visit':
        return { icon: UserCheck, label: 'First Visit', color: 'bg-green-100 text-green-700' };
      case 'emergency':
        return { icon: AlertTriangle, label: 'Emergency Visit', color: 'bg-red-100 text-red-700' };
      default:
        return { icon: Calendar, label: 'Scheduled Appointment', color: 'bg-blue-100 text-blue-700' };
    }
  };

  const visitInfo = getVisitTypeInfo();
  const VisitIcon = visitInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <VisitIcon className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-xl">In-Patient Treatment Record</div>
              <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                Patient: {patientName || 'Unknown'} ({patientId || 'No ID'})
                <Badge className={visitInfo.color}>
                  {visitInfo.label}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Visit Details */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="visit-date">Visit Date</Label>
            <Input
              id="visit-date"
              type="date"
              value={treatmentData.visitDate}
              onChange={(e) => handleInputChange('visitDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visit-time">Visit Time</Label>
            <Input
              id="visit-time"
              type="time"
              value={treatmentData.visitTime}
              onChange={(e) => handleInputChange('visitTime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pain-level">Pain Level (1-10)</Label>
            <Select value={treatmentData.painLevel} onValueChange={(value) => handleInputChange('painLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Rate pain" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 10}, (_, i) => (
                  <SelectItem key={i+1} value={(i+1).toString()}>
                    {i+1} {i === 0 && '(No Pain)'} {i === 4 && '(Moderate)'} {i === 9 && '(Severe)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Assessment */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-600" />
            Clinical Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chief-complaint">Chief Complaint</Label>
            <Textarea
              id="chief-complaint"
              placeholder="What is the patient's main concern or complaint?"
              value={treatmentData.chiefComplaint}
              onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinical-findings">Clinical Findings & Examination</Label>
            <Textarea
              id="clinical-findings"
              placeholder="Describe what you observed during the examination"
              value={treatmentData.clinicalFindings}
              onChange={(e) => handleInputChange('clinicalFindings', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Your professional diagnosis based on findings"
              value={treatmentData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teeth Selector */}
      <VisualTeethSelector 
        selectedTeeth={selectedTeeth} 
        onTeethChange={setSelectedTeeth} 
      />

      {/* Treatment & Recommendations */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Treatment & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="treatment-performed">Treatment Performed Today</Label>
            <Textarea
              id="treatment-performed"
              placeholder="Describe the treatment provided during this visit"
              value={treatmentData.treatmentPerformed}
              onChange={(e) => handleInputChange('treatmentPerformed', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medications" className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-orange-500" />
                Medications Prescribed
              </Label>
              <Textarea
                id="medications"
                placeholder="List medications, dosage, and instructions"
                value={treatmentData.medicationsPrescribed}
                onChange={(e) => handleInputChange('medicationsPrescribed', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tests-recommended">Tests/X-rays Recommended</Label>
              <Textarea
                id="tests-recommended"
                placeholder="Any additional tests or imaging required"
                value={treatmentData.testsRecommended}
                onChange={(e) => handleInputChange('testsRecommended', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="follow-up-instructions">Follow-up Instructions</Label>
            <Textarea
              id="follow-up-instructions"
              placeholder="Care instructions, what to avoid, when to return, etc."
              value={treatmentData.followUpInstructions}
              onChange={(e) => handleInputChange('followUpInstructions', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Next Appointment (Optional) */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Next Appointment (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-orange-100 rounded-lg">
            <Checkbox 
              id="next-appointment" 
              checked={treatmentData.nextAppointmentRequired}
              onCheckedChange={(checked) => handleInputChange('nextAppointmentRequired', checked)}
            />
            <Label htmlFor="next-appointment" className="text-sm font-medium">
              Schedule next appointment
            </Label>
          </div>
          
          {treatmentData.nextAppointmentRequired && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next-date">Next Appointment Date</Label>
                <Input
                  id="next-date"
                  type="date"
                  value={treatmentData.nextAppointmentDate}
                  onChange={(e) => handleInputChange('nextAppointmentDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-time">Time</Label>
                <Input
                  id="next-time"
                  type="time"
                  value={treatmentData.nextAppointmentTime}
                  onChange={(e) => handleInputChange('nextAppointmentTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-purpose">Purpose</Label>
                <Select 
                  value={treatmentData.nextAppointmentPurpose} 
                  onValueChange={(value) => handleInputChange('nextAppointmentPurpose', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up">Follow-up Check</SelectItem>
                    <SelectItem value="continue-treatment">Continue Treatment</SelectItem>
                    <SelectItem value="test-results">Review Test Results</SelectItem>
                    <SelectItem value="crown-fitting">Crown Fitting</SelectItem>
                    <SelectItem value="cleaning">Regular Cleaning</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleSaveTreatment} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
          <Save className="w-5 h-5 mr-2" />
          Save Treatment Record
        </Button>
      </div>
    </div>
  );
};
