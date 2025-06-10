
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
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  TestTube, 
  Pill, 
  CalendarPlus,
  Save,
  AlertCircle
} from 'lucide-react';

interface ToothSelection {
  tooth: string;
  parts: string[];
}

type VisitType = 'scheduled' | 'emergency' | 'first-visit';

interface PatientTreatmentSessionProps {
  patientId: string;
  patientName: string;
  visitType?: VisitType;
}

export const PatientTreatmentSession: React.FC<PatientTreatmentSessionProps> = ({
  patientId,
  patientName,
  visitType = 'scheduled'
}) => {
  const { toast } = useToast();
  const [selectedTeeth, setSelectedTeeth] = useState<ToothSelection[]>([]);
  const [sessionData, setSessionData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    visitType,
    chiefComplaint: '',
    clinicalFindings: '',
    diagnosis: '',
    treatmentDone: '',
    treatmentPlan: '',
    medications: '',
    testsRecommended: '',
    instructions: '',
    painLevel: '',
    followUpRequired: false,
    nextAppointmentDate: '',
    nextAppointmentPurpose: '',
    nextAppointmentNotes: ''
  });

  const handleSaveSession = () => {
    const sessionRecord = {
      id: `TS${Date.now()}`,
      patientId,
      ...sessionData,
      teethTreated: selectedTeeth,
      timestamp: new Date().toISOString()
    };

    console.log('Saving treatment session:', sessionRecord);
    
    toast({
      title: "Treatment Session Recorded Successfully! 📋",
      description: `Treatment details for ${patientName} have been saved.`,
    });

    // Reset form for next entry
    setSessionData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      visitType: 'scheduled',
      chiefComplaint: '',
      clinicalFindings: '',
      diagnosis: '',
      treatmentDone: '',
      treatmentPlan: '',
      medications: '',
      testsRecommended: '',
      instructions: '',
      painLevel: '',
      followUpRequired: false,
      nextAppointmentDate: '',
      nextAppointmentPurpose: '',
      nextAppointmentNotes: ''
    });
    setSelectedTeeth([]);
  };

  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-700 border-red-300';
      case 'first-visit': return 'bg-green-100 text-green-700 border-green-300';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Patient Treatment Session</h2>
                <p className="text-sm text-slate-600">{patientName} - ID: {patientId}</p>
              </div>
            </div>
            <Badge className={`${getVisitTypeColor(sessionData.visitType)} border font-medium`}>
              {sessionData.visitType.replace('-', ' ').toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-date">Session Date</Label>
              <Input
                id="session-date"
                type="date"
                value={sessionData.date}
                onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-time">Session Time</Label>
              <Input
                id="session-time"
                type="time"
                value={sessionData.time}
                onChange={(e) => setSessionData({...sessionData, time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-type">Visit Type</Label>
              <Select 
                value={sessionData.visitType} 
                onValueChange={(value: VisitType) => setSessionData({...sessionData, visitType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled Appointment</SelectItem>
                  <SelectItem value="emergency">Emergency Visit</SelectItem>
                  <SelectItem value="first-visit">First Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-2">
            <Label htmlFor="chief-complaint" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Chief Complaint
            </Label>
            <Textarea
              id="chief-complaint"
              placeholder="What brought the patient in today? Patient's main concern..."
              value={sessionData.chiefComplaint}
              onChange={(e) => setSessionData({...sessionData, chiefComplaint: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          {/* Clinical Findings */}
          <div className="space-y-2">
            <Label htmlFor="clinical-findings" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              Clinical Findings & Examination
            </Label>
            <Textarea
              id="clinical-findings"
              placeholder="What did you observe during examination? Clinical signs, symptoms..."
              value={sessionData.clinicalFindings}
              onChange={(e) => setSessionData({...sessionData, clinicalFindings: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          {/* Teeth Selector */}
          <div className="space-y-4">
            <Label>Teeth Involved in Treatment</Label>
            <VisualTeethSelector 
              selectedTeeth={selectedTeeth} 
              onTeethChange={setSelectedTeeth} 
            />
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              Diagnosis
            </Label>
            <Textarea
              id="diagnosis"
              placeholder="Your professional diagnosis based on examination..."
              value={sessionData.diagnosis}
              onChange={(e) => setSessionData({...sessionData, diagnosis: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          {/* Treatment Done */}
          <div className="space-y-2">
            <Label htmlFor="treatment-done" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-purple-600" />
              Treatment Performed Today
            </Label>
            <Textarea
              id="treatment-done"
              placeholder="What treatment was completed in this session..."
              value={sessionData.treatmentDone}
              onChange={(e) => setSessionData({...sessionData, treatmentDone: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          {/* Future Treatment Plan */}
          <div className="space-y-2">
            <Label htmlFor="treatment-plan">Future Treatment Plan</Label>
            <Textarea
              id="treatment-plan"
              placeholder="What treatments are planned for future visits..."
              value={sessionData.treatmentPlan}
              onChange={(e) => setSessionData({...sessionData, treatmentPlan: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          {/* Tests & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tests-recommended" className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-cyan-600" />
                Tests Recommended
              </Label>
              <Textarea
                id="tests-recommended"
                placeholder="X-rays, blood tests, etc..."
                value={sessionData.testsRecommended}
                onChange={(e) => setSessionData({...sessionData, testsRecommended: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications" className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-red-600" />
                Medications Prescribed
              </Label>
              <Textarea
                id="medications"
                placeholder="Medications, dosage, duration..."
                value={sessionData.medications}
                onChange={(e) => setSessionData({...sessionData, medications: e.target.value})}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Patient Instructions & Care</Label>
            <Textarea
              id="instructions"
              placeholder="Post-treatment care, dietary restrictions, hygiene instructions..."
              value={sessionData.instructions}
              onChange={(e) => setSessionData({...sessionData, instructions: e.target.value})}
            />
          </div>

          <Separator />

          {/* Next Appointment Scheduling */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="follow-up" 
                checked={sessionData.followUpRequired}
                onCheckedChange={(checked: boolean) => setSessionData({...sessionData, followUpRequired: checked})}
              />
              <Label htmlFor="follow-up" className="flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-orange-600" />
                Schedule Next Appointment
              </Label>
            </div>

            {sessionData.followUpRequired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="next-appointment-date">Next Appointment Date</Label>
                  <Input
                    id="next-appointment-date"
                    type="date"
                    value={sessionData.nextAppointmentDate}
                    onChange={(e) => setSessionData({...sessionData, nextAppointmentDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-appointment-purpose">Purpose</Label>
                  <Select 
                    value={sessionData.nextAppointmentPurpose} 
                    onValueChange={(value) => setSessionData({...sessionData, nextAppointmentPurpose: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Reason for next visit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow-up">Follow-up Check</SelectItem>
                      <SelectItem value="continue-treatment">Continue Treatment</SelectItem>
                      <SelectItem value="test-results">Review Test Results</SelectItem>
                      <SelectItem value="crown-fitting">Crown Fitting</SelectItem>
                      <SelectItem value="root-canal-completion">Complete Root Canal</SelectItem>
                      <SelectItem value="cleaning">Regular Cleaning</SelectItem>
                      <SelectItem value="adjustment">Adjustment/Fine-tuning</SelectItem>
                      <SelectItem value="medication-review">Medication Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="next-appointment-notes">Instructions for Next Visit</Label>
                  <Textarea
                    id="next-appointment-notes"
                    placeholder="Special preparations, things to bring, etc..."
                    value={sessionData.nextAppointmentNotes}
                    onChange={(e) => setSessionData({...sessionData, nextAppointmentNotes: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSession} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Treatment Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
