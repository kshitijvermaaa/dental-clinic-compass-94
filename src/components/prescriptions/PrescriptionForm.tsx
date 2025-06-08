
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, FileText, User, Stethoscope } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    diagnosis: '',
    symptoms: '',
    notes: ''
  });
  
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: '1', name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Prescription Created Successfully!",
      description: `Prescription for ${formData.patientName} has been created and saved.`,
    });
    onOpenChange(false);
    // Reset form
    setFormData({ patientName: '', patientId: '', diagnosis: '', symptoms: '', notes: '' });
    setMedicines([{ id: '1', name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setMedicines(prev => [...prev, newMedicine]);
  };

  const removeMedicine = (id: string) => {
    if (medicines.length > 1) {
      setMedicines(prev => prev.filter(med => med.id !== id));
    }
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines(prev => prev.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Create New Prescription
          </DialogTitle>
          <DialogDescription>
            Add patient information, diagnosis, and medication details.
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
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID *</Label>
                <Input 
                  id="patient-id" 
                  placeholder="Enter patient ID"
                  value={formData.patientId}
                  onChange={(e) => handleInputChange('patientId', e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input 
                  id="diagnosis" 
                  placeholder="Primary diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Input 
                  id="symptoms" 
                  placeholder="Patient symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medications</h3>
              <Button type="button" onClick={addMedicine} size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Medicine
              </Button>
            </div>
            
            <div className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={medicine.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Medicine {index + 1}</h4>
                    {medicines.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeMedicine(medicine.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Medicine Name *</Label>
                      <Input 
                        placeholder="e.g., Amoxicillin"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage *</Label>
                      <Input 
                        placeholder="e.g., 500mg"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency *</Label>
                      <Select 
                        value={medicine.frequency} 
                        onValueChange={(value) => updateMedicine(medicine.id, 'frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once-daily">Once daily</SelectItem>
                          <SelectItem value="twice-daily">Twice daily</SelectItem>
                          <SelectItem value="thrice-daily">Thrice daily</SelectItem>
                          <SelectItem value="four-times">Four times daily</SelectItem>
                          <SelectItem value="as-needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration *</Label>
                      <Input 
                        placeholder="e.g., 7 days"
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Instructions</Label>
                      <Input 
                        placeholder="e.g., Take after meals"
                        value={medicine.instructions}
                        onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Any additional instructions or notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
              Create Prescription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
