// src/app/dashboard/AppointmentModal.tsx
'use client';

import { useState, useRef } from 'react';
import styles from './AppointmentModal.module.css';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (appointmentData: any) => void;
  selectedUser: User | null;  // Changed from User | undefined
}

export default function AppointmentModal({ isOpen, onClose, onSchedule, selectedUser }: AppointmentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [voiceNote, setVoiceNote] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData = {
      title,
      description,
      date,
      time,
      appointedTo: selectedUser?.id,
      appointmentWith: selectedUser?.username || selectedUser?.email,
      voiceNote,
    };
    onSchedule(appointmentData);
    onClose();
  };
  
  const handleVoiceNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVoiceNote(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Schedule Appointment with {selectedUser?.username || selectedUser?.email}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleVoiceNoteChange}
            style={{ display: 'none' }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
              Add Voice Note
            </button>
            {voiceNote && <p>Voice note added: {voiceNote.name}</p>}
            <div className={styles.modalActions}>
            <button type="submit">Schedule Appointment</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}