
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Search, User, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const appointmentsData = [
  {
    id: 'A001',
    patientName: 'John Doe',
    patientId: 'P001',
    time: '09:00 AM',
    phone: '+91 9876543210',
    reason: 'Routine Checkup',
    status: 'scheduled',
    type: 'checkup'
  },
  {
    id: 'A002',
    patientName: 'Sarah Johnson',
    patientId: 'P024',
    time: '10:30 AM',
    phone: '+91 9876543211',
    reason: 'Root Canal Follow-up',
    status: 'in-progress',
    type: 'treatment'
  },
  {
    id: 'A003',
    patientName: 'Mike Wilson',
    patientId: 'P035',
    time: '02:00 PM',
    phone: '+91 9876543212',
    reason: 'Teeth Cleaning',
    status: 'completed',
    type: 'cleaning'
  }
];

const Appointments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAppointments = appointmentsData.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-slate-600">Manage patient appointments and schedules</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Today's Date */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today's Schedule - {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              {filteredAppointments.length} appointments scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{appointment.patientName}</span>
                      <span className="text-sm text-slate-500">({appointment.patientId})</span>
                      <span className="text-sm font-mono text-slate-600">{appointment.time}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {appointment.phone}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {appointment.reason}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                    {appointment.status}
                  </Badge>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/search?patient=${appointment.patientId}`)}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/prescriptions')}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
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
