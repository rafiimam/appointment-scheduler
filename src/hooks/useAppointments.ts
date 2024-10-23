// src/hooks/useAppointments.ts
import { useState, useEffect } from 'react';
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
import { useAuth } from './useAuth';
import { Appointment, AppointmentStatus } from '../types';

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'schedulerId'>) => Promise<string>;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  refreshAppointments: () => Promise<void>;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAppointments = async (): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      const q = query(
        collection(db, 'appointments'),
        where('participantId', '==', user.id),
        orderBy('dateTime', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];

      setAppointments(appointmentsData);
      setError(null);
    } catch (err) {
      setError('Error fetching appointments');
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
      const newAppointment = {
        ...appointmentData,
        schedulerId: user.id,
        status: 'pending' as AppointmentStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      await fetchAppointments();
      return docRef.id;
    } catch (err) {
      setError('Error creating appointment');
      throw err;
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<void> => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { 
        status,
        updatedAt: new Date().toISOString()
      });
      await fetchAppointments();
    } catch (err) {
      setError('Error updating appointment status');
      throw err;
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await deleteDoc(appointmentRef);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    } catch (err) {
      setError('Error canceling appointment');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    refreshAppointments: fetchAppointments
  };
};