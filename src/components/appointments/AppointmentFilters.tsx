// src/components/appointments/AppointmentFilters.tsx

import React from 'react';

interface AppointmentFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-lg ${currentFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange('pending')}
        className={`px-4 py-2 rounded-lg ${currentFilter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Pending
      </button>
      <button
        onClick={() => onFilterChange('accepted')}
        className={`px-4 py-2 rounded-lg ${currentFilter === 'accepted' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Accepted
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        className={`px-4 py-2 rounded-lg ${currentFilter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Completed
      </button>
    </div>
  );
};
