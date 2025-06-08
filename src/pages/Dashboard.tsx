
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TodaysAppointments } from '@/components/dashboard/TodaysAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Calendar, Users, Activity, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const statsData = [
    {
      title: 'Total Patients',
      value: '1,234',
      icon: Users,
      trend: '+12% from last month',
      trendUp: true,
    },
    {
      title: "Today's Appointments",
      value: '8',
      icon: Calendar,
      trend: '2 completed, 6 pending',
      trendUp: true,
    },
    {
      title: 'This Week',
      value: '24',
      icon: Activity,
      trend: '+8% from last week',
      trendUp: true,
    },
    {
      title: 'Monthly Revenue',
      value: '₹45,670',
      icon: TrendingUp,
      trend: '+15% from last month',
      trendUp: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Animation */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Welcome back! Here's what's happening at your clinic today.
          </p>
        </div>

        {/* Stats Cards with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div 
              key={stat.title} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments - Takes 2 columns */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <TodaysAppointments />
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
            <QuickActions />
          </div>
        </div>

        {/* Additional Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest actions in your clinic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'New patient registered', patient: 'John Doe', time: '10 minutes ago' },
                  { action: 'Appointment completed', patient: 'Sarah Johnson', time: '1 hour ago' },
                  { action: 'Prescription generated', patient: 'Mike Wilson', time: '2 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div>
                      <div className="font-medium text-slate-900">{activity.action}</div>
                      <div className="text-sm text-slate-600">{activity.patient}</div>
                    </div>
                    <div className="text-xs text-slate-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '700ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>
                Don't forget these important items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { task: 'Follow up with patient', due: 'Today', priority: 'high' },
                  { task: 'Order dental supplies', due: 'Tomorrow', priority: 'medium' },
                  { task: 'Update treatment records', due: 'This week', priority: 'low' },
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-medium text-slate-900">{task.task}</div>
                      <div className="text-sm text-slate-600">Due: {task.due}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
