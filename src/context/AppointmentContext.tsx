// src/context/AppointmentContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentContextType 
} from '../types';

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider = ({ children }: AppointmentProviderProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Query both appointments where user is scheduler or participant
      const schedulerQuery = query(
        collection(db, 'appointments'),
        where('schedulerId', '==', user.id),
        orderBy('dateTime', 'asc')
      );

      const participantQuery = query(
        collection(db, 'appointments'),
        where('participantId', '==', user.id),
        orderBy('dateTime', 'asc')
      );

      const [schedulerSnapshot, participantSnapshot] = await Promise.all([
        getDocs(schedulerQuery),
        getDocs(participantQuery)
      ]);

      const schedulerAppointments = schedulerSnapshot.docs.map(
        (doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data()
        })
      );

      const participantAppointments = participantSnapshot.docs.map(
        (doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data()
        })
      );

      // Combine and deduplicate appointments
      const allAppointments = [...schedulerAppointments, ...participantAppointments];
      const uniqueAppointments = Array.from(
        new Map(allAppointments.map(item => [item.id, item])).values()
      ) as Appointment[];

      // Sort by dateTime
      uniqueAppointments.sort((a, b) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );

      setAppointments(uniqueAppointments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'schedulerId'>
  ): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      const newAppointment = {
        ...appointmentData,
        schedulerId: user.id,
        status: 'pending' as AppointmentStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      
      // Update local state
      setAppointments(prev => [...prev, { ...newAppointment, id: docRef.id }]);
      
      return docRef.id;
    } catch (err) {
      setError('Failed to create appointment');
      throw err;
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string, 
    status: AppointmentStatus
  ): Promise<void> => {
    try {
      setError(null);
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const updateData = {
        status,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(appointmentRef, updateData);
      
      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, ...updateData }
            : apt
        )
      );
    } catch (err) {
      setError('Failed to update appointment status');
      throw err;
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    try {
      setError(null);
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await deleteDoc(appointmentRef);
      
      // Update local state
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    } catch (err) {
      setError('Failed to cancel appointment');
      throw err;
    }
  };

  // Fetch appointments when user changes
  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const value: AppointmentContextType = {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    refreshAppointments: fetchAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the appointment context
export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};