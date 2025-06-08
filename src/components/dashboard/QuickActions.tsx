
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus, Calendar, Search, FileText } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to get things done quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4" />
          Register New Patient
        </Button>
        <Button variant="outline" className="w-full justify-start gap-3">
          <Calendar className="w-4 h-4" />
          Schedule Appointment
        </Button>
        <Button variant="outline" className="w-full justify-start gap-3">
          <Search className="w-4 h-4" />
          Find Patient
        </Button>
        <Button variant="outline" className="w-full justify-start gap-3">
          <FileText className="w-4 h-4" />
          Generate Prescription
        </Button>
        
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Recent Patients</h4>
          <div className="space-y-2">
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer p-2 hover:bg-slate-50 rounded">
              John Doe (P001)
            </div>
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer p-2 hover:bg-slate-50 rounded">
              Sarah Johnson (P024)
            </div>
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer p-2 hover:bg-slate-50 rounded">
              Mike Wilson (P035)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
