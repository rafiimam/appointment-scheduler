// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppointments } from '../context/AppointmentContext';
import { AppointmentList } from '../components/appointments/AppointmentList';
import { AppointmentFilters } from '../components/appointments/AppointmentFilters';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { AppointmentStatuses} from '../types';


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { appointments, loading, error } = useAppointments();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  console.log("User:", user);
  console.log("Appointments:", appointments);
  console.log("Loading:", loading);
  console.log("Error:", error);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const filteredAppointments = appointments.filter(apt => 
    statusFilter === 'all' || apt.status === statusFilter
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === AppointmentStatuses.PENDING).length,
    upcoming: appointments.filter(apt => 
      apt.status === AppointmentStatuses.ACCEPTED && new Date(apt.dateTime) > new Date()
    ).length,
    completed: appointments.filter(apt => apt.status === AppointmentStatuses.COMPLETED).length
  };
  

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-gray-600">Here's an overview of your appointments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center mb-6">
        <AppointmentFilters 
          currentFilter={statusFilter} 
          onFilterChange={setStatusFilter} 
        />
        <button
          onClick={() => navigate('/schedule')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Schedule New Appointment
        </button>
      </div>

      {/* Appointments List */}
      <AppointmentList appointments={filteredAppointments} />
    </div>
  );
};

export default Dashboard;