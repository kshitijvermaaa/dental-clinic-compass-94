
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appointment Scheduled",
      description: "New appointment has been successfully scheduled.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new patient appointment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input id="patient-name" placeholder="Enter patient name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID</Label>
              <Input id="patient-id" placeholder="P001" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-date">Date</Label>
              <Input id="appointment-date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment-time">Time</Label>
              <Input id="appointment-time" type="time" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+91 9876543210" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointment-type">Appointment Type</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkup">Routine Checkup</SelectItem>
                <SelectItem value="cleaning">Teeth Cleaning</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea id="reason" placeholder="Brief description of the appointment reason" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Schedule Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
