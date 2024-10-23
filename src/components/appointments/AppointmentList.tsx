// src/components/appointments/AppointmentList.tsx

import React from 'react';
import { Appointment } from '../../types'; // Adjust the path based on your structure

interface AppointmentListProps {
  appointments: Appointment[];
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="text-gray-500">No appointments found.</div>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id} className="border p-4 rounded-md shadow-sm">
            <h3 className="font-bold">{appointment.title}</h3>
            <p>{new Date(appointment.dateTime).toLocaleString()}</p>
            <p>Status: {appointment.status}</p>
          </div>
        ))
      )}
    </div>
  );
};
