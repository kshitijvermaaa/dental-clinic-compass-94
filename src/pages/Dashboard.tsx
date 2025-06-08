
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, Plus, TrendingUp, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TodaysAppointments } from '@/components/dashboard/TodaysAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dental Clinic Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back, Dr. Smith. Here's what's happening today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Today's Patients"
            value="12"
            icon={Users}
            trend="+2 from yesterday"
            trendUp={true}
          />
          <StatsCard
            title="Appointments"
            value="15"
            icon={Calendar}
            trend="3 remaining"
            trendUp={false}
          />
          <StatsCard
            title="Revenue (Today)"
            value="₹8,500"
            icon={TrendingUp}
            trend="+15% from avg"
            trendUp={true}
          />
          <StatsCard
            title="Active Treatments"
            value="8"
            icon={Activity}
            trend="2 follow-ups needed"
            trendUp={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <TodaysAppointments />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
