// src/pages/Schedule.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppointments } from '../context/AppointmentContext';
import UserSearch from '../components/users/UserSearch';
import type { User } from '../types';

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedParticipant) return;

    try {
      setError(null);
      await createAppointment({
        title,
        description,
        dateTime,
        participantId: selectedParticipant.id,
        audioMessageUrl: '',
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create appointment');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Participant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Participant
              </label>
              <UserSearch
                onUserSelect={setSelectedParticipant}
                selectedUser={selectedParticipant}
              />
            </div>

            {/* Appointment Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter appointment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter appointment description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date and Time
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center text-red-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedParticipant || !title || !dateTime}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
