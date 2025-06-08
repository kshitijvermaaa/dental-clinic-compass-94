
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Phone } from 'lucide-react';

const appointmentsData = [
  {
    id: 1,
    time: '09:00 AM',
    patientName: 'John Doe',
    patientId: 'P001',
    phone: '+91 98765 43210',
    type: 'Cleaning',
    status: 'scheduled'
  },
  {
    id: 2,
    time: '10:30 AM',
    patientName: 'Sarah Johnson',
    patientId: 'P024',
    phone: '+91 87654 32109',
    type: 'Root Canal',
    status: 'in-progress'
  },
  {
    id: 3,
    time: '02:00 PM',
    patientName: 'Mike Wilson',
    patientId: 'P035',
    phone: '+91 76543 21098',
    type: 'Consultation',
    status: 'scheduled'
  },
  {
    id: 4,
    time: '03:30 PM',
    patientName: 'Emma Brown',
    patientId: 'P018',
    phone: '+91 65432 10987',
    type: 'Filling',
    status: 'completed'
  }
];

export const TodaysAppointments: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Today's Appointments
        </CardTitle>
        <CardDescription>
          {appointmentsData.length} appointments scheduled for today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointmentsData.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Clock className="w-4 h-4 text-slate-500" />
                {appointment.time}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900">
                    {appointment.patientName}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({appointment.patientId})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {appointment.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{appointment.type}</span>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-4">
          View All Appointments
        </Button>
      </CardContent>
    </Card>
  );
};
