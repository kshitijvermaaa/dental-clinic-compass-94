
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Plus, Search } from 'lucide-react';

const appointmentsData = [
  {
    id: 1,
    date: '2024-06-08',
    time: '09:00 AM',
    patientName: 'John Doe',
    patientId: 'P001',
    type: 'Cleaning',
    status: 'scheduled',
    duration: '30 min'
  },
  {
    id: 2,
    date: '2024-06-08',
    time: '10:30 AM',
    patientName: 'Sarah Johnson',
    patientId: 'P024',
    type: 'Root Canal',
    status: 'in-progress',
    duration: '90 min'
  },
  {
    id: 3,
    date: '2024-06-09',
    time: '02:00 PM',
    patientName: 'Mike Wilson',
    patientId: 'P035',
    type: 'Consultation',
    status: 'scheduled',
    duration: '45 min'
  }
];

const Appointments = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-slate-600">Manage and schedule patient appointments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Today', value: '8', color: 'blue' },
            { label: 'This Week', value: '24', color: 'green' },
            { label: 'Pending', value: '3', color: 'yellow' },
            { label: 'Completed', value: '156', color: 'purple' }
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Appointments List */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              {appointmentsData.length} appointments scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsData.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{appointment.patientName}</span>
                      <span className="text-sm text-slate-500">({appointment.patientId})</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </span>
                      <span>{appointment.duration}</span>
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                    {appointment.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
