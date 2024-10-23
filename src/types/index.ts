// src/types/index.ts

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  role: UserRole;
}

export const AppointmentStatuses = {
    PENDING: 'pending' as const,
    ACCEPTED: 'accepted' as const,
    DECLINED: 'declined' as const,
    CANCELLED: 'cancelled' as const,
    COMPLETED: 'completed' as const,
  };
  
  export type AppointmentStatus = typeof AppointmentStatuses[keyof typeof AppointmentStatuses];

export interface Appointment {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  schedulerId: string;
  participantId: string;
  status: AppointmentStatus;
  audioMessageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'schedulerId'>) => Promise<string>;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  refreshAppointments: () => Promise<void>;
}