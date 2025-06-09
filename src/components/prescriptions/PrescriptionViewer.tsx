
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Printer } from 'lucide-react';

interface PrescriptionViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: any;
}

export const PrescriptionViewer: React.FC<PrescriptionViewerProps> = ({ open, onOpenChange, prescription }) => {
  if (!prescription) return null;

  const handleDownload = () => {
    // Create prescription content for download
    const content = `
DENTAL PRESCRIPTION

Clinic: DentalCare Pro Clinic
Date: ${prescription.date}
Prescription ID: ${prescription.id}

Patient Information:
Name: ${prescription.patientName}
Patient ID: ${prescription.patientId}

Diagnosis: ${prescription.diagnosis}

Prescribed Medications:
${prescription.medicines.map((med: string, index: number) => `${index + 1}. ${med}`).join('\n')}

Doctor: Dr. Smith
License: DL12345

---
This is a computer-generated prescription.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${prescription.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Prescription ${prescription.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .clinic-name { font-size: 24px; font-weight: bold; }
              .prescription-id { font-size: 14px; color: #666; }
              .section { margin: 20px 0; }
              .label { font-weight: bold; }
              .medicines { list-style: decimal; padding-left: 20px; }
              .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="clinic-name">DentalCare Pro Clinic</div>
              <div class="prescription-id">Prescription ID: ${prescription.id}</div>
              <div>Date: ${prescription.date}</div>
            </div>
            
            <div class="section">
              <div class="label">Patient Information:</div>
              <div>Name: ${prescription.patientName}</div>
              <div>Patient ID: ${prescription.patientId}</div>
            </div>
            
            <div class="section">
              <div class="label">Diagnosis:</div>
              <div>${prescription.diagnosis}</div>
            </div>
            
            <div class="section">
              <div class="label">Prescribed Medications:</div>
              <ol class="medicines">
                ${prescription.medicines.map((med: string) => `<li>${med}</li>`).join('')}
              </ol>
            </div>
            
            <div class="footer">
              <div>Doctor: Dr. Smith</div>
              <div>License: DL12345</div>
              <div style="margin-top: 20px; font-size: 12px; color: #666;">
                This is a computer-generated prescription.
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Prescription Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">DentalCare Pro Clinic</h2>
            <p className="text-sm text-slate-600">Prescription ID: {prescription.id}</p>
            <p className="text-sm text-slate-600">Date: {prescription.date}</p>
          </div>

          <Separator />

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-slate-900">Patient Information</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Name:</span> {prescription.patientName}</div>
                <div><span className="font-medium">Patient ID:</span> {prescription.patientId}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Status</h4>
              <Badge className={`${prescription.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'} border font-medium text-xs`}>
                {prescription.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Diagnosis */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Diagnosis</h4>
            <p className="text-sm text-slate-600">{prescription.diagnosis}</p>
          </div>

          <Separator />

          {/* Medications */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Prescribed Medications</h4>
            <ol className="list-decimal list-inside space-y-1">
              {prescription.medicines.map((medicine: string, index: number) => (
                <li key={index} className="text-sm text-slate-600">{medicine}</li>
              ))}
            </ol>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-sm text-slate-600 space-y-1">
            <div><span className="font-medium">Doctor:</span> Dr. Smith</div>
            <div><span className="font-medium">License:</span> DL12345</div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
