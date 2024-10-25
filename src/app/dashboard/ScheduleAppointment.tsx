'use client';

import { useState, useEffect, useRef } from 'react';
import { Typography, Card, CardContent, Autocomplete, TextField, Button, CardActions } from '@mui/material';
import VoiceRecorder from './VoiceRecorder';
import Popup from './Popup';


interface User {
  id: string;
  username: string;
  email: string;
}

interface ScheduleAppointmentProps {
  selectedUser: User | null;
  currentUser: User | null;
  isModal?: boolean;
  onClose?: () => void;
  className?: string;  
}

export default function ScheduleAppointment({ 
  selectedUser, 
  isModal = false,
  onClose,
  className 
}: ScheduleAppointmentProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedSearchUser, setSelectedSearchUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //console.log('Selected User:', selectedSearchUser);
  // Fetch all users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) return;
  
      const { username } = JSON.parse(storedUser);
      
      try {
        const response = await fetch('/api/currentUser', {
          headers: {
            'user-username': username
          }
        });
        
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        }
      } catch (error) {
        //console.error('Error fetching current user:', error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  // Update search term when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setSearchTerm(selectedUser.username || selectedUser.email);
      setSelectedSearchUser(selectedUser);
    }
  }, [selectedUser]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      //console.log('ScheduleAppointment - Fetched Users:', data);
      setAllUsers(data);
      setSuggestions(data); // Initialize suggestions with all users
    } catch (error) {
      //console.error('Error fetching users:', error);
    }
  };

  const handleVoiceNoteComplete = (base64Audio: string) => {
    setVoiceNote(base64Audio);
  };
  

  const handleUserSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleUserSelect = (value: string | null) => {
    if (value) {
      const user = allUsers.find(u => (u.username || u.email) === value);
      setSelectedSearchUser(user || null);
    } else {
      setSelectedSearchUser(null);
    }
  };

  const handleSchedule = async () => {
    if (!selectedSearchUser || !currentUser) {
      setPopupMessage('Please select a user for the appointment');
      setPopupOpen(true);
      return;
    }
  
    const appointmentData = {
      title,
      description,
      appointmentTime: time,
      appointmentDate: date,
      appointedTo: selectedSearchUser.id,
      appointmentWith: selectedSearchUser.username,
      createdBy: currentUser.username,
      currentStatus: 'pending',
      voiceNote: voiceNote
    };
  
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });
  
      if (response.ok) {
        setPopupMessage('Appointment scheduled successfully');
        setPopupOpen(true);
        // Reset form
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setVoiceNote(null);
        setSearchTerm('');
        setSelectedSearchUser(null);
      } else {
        const error = await response.json();
        //console.error('Appointment creation failed:', error);
        setPopupMessage(error.message || 'Failed to schedule appointment');
        setPopupOpen(true);
      }
    } catch (error) {
      //console.error('Error scheduling appointment:', error);
      setPopupMessage('An error occurred while scheduling the appointment');
      setPopupOpen(true);
    }
  };


  return (
    <div className={className} style={{ textAlign: 'center', padding: isModal ? 0 : '20px' }}>
      <Typography variant="h4" gutterBottom>
        Schedule A New Appointment
        {isModal && (
          <Button 
            onClick={onClose}
            sx={{ float: 'right' }}
          >
            ✕
          </Button>
        )}
      </Typography>
      <Card elevation={isModal ? 0 : 3} style={{ 
        padding: '20px', 
        maxWidth: '600px', 
        margin: '0 auto',
        boxShadow: isModal ? 'none' : undefined 
      }}>
        <CardContent>
          {!isModal ? (
            <Autocomplete
              freeSolo
              options={suggestions.map((user) => user.username || user.email)}
              inputValue={searchTerm}
              onInputChange={(_, value) => handleUserSearch(value)}
              onChange={(_, value) => handleUserSelect(value)}
              renderInput={(params) => (
                <TextField {...params} label="Search for a user" variant="outlined" fullWidth />
              )}
            />
          ) : (
            <Typography variant="body1" style={{ marginBottom: '15px' }}>
              Scheduling appointment with: <strong>{selectedUser?.username}</strong>
            </Typography>
          )}
          {selectedSearchUser && (
            <Typography variant="body2" style={{ marginTop: '10px' }}>
              Appointment with: {selectedSearchUser.username || selectedSearchUser.email}
            </Typography>
          )}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            style={{ marginTop: '15px' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            required
            rows={4}
            style={{ marginTop: '15px' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            required
            style={{ marginTop: '15px' }}
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            label="Time"
            type="time"
            variant="outlined"
            fullWidth
            required
            style={{ marginTop: '15px' }}
            InputLabelProps={{
              shrink: true,
            }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <VoiceRecorder onRecordingComplete={handleVoiceNoteComplete} />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSchedule}
          >
            Schedule Appointment
          </Button>
        </CardActions>
      </Card>
      <Popup 
  open={popupOpen}
  message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
}