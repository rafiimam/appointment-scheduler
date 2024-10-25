'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Dashboard.module.css';
import AudioPlayer from './AudioPlayer';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField, Paper, Tabs, Tab } from '@mui/material';
import Popup from './Popup';


import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Grid,
  Container
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

interface User {
  id: string;
  email: string;
  username: string;
}

interface AppointmentManagementProps {
  currentUser: User;
}

interface Appointment {
  _id: string;
  title: string;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
  currentStatus: string;
  createdBy: string;
  appointmentWith: string;
  voiceNote?: string;
}

export default function AppointmentManagement({ currentUser }: AppointmentManagementProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [scheduledAppointments, setScheduledAppointments] = useState<Appointment[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [receivedSearchTerm, setReceivedSearchTerm] = useState('');
  const [scheduledSearchTerm, setScheduledSearchTerm] = useState('');
  const [receivedTabValue, setReceivedTabValue] = useState(0);
  const [scheduledTabValue, setScheduledTabValue] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const filterAppointments = (appointments: Appointment[], search: string) => {
    return appointments.filter(app =>
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
    );
  };

  const splitAppointments = (appointments: Appointment[]) => {
    const now = new Date();
    return {
      upcoming: appointments.filter(app => {
        const appointmentDateTime = new Date(`${app.appointmentDate}T${app.appointmentTime}`);
        return appointmentDateTime > now && 
               (app.currentStatus === 'pending' || app.currentStatus === 'approved');
      }),
      expired: appointments.filter(app => {
        const appointmentDateTime = new Date(`${app.appointmentDate}T${app.appointmentTime}`);
        return appointmentDateTime <= now;
      })
    };
  };

  const fetchAppointments = useCallback(async (user: { username: string }) => {
    try {
      const response = await fetch(`/api/appointments?username=${user.username}`);
      const scheduledResponse = await fetch(`/api/appointments/scheduled?username=${user.username}`);

      if (!response.ok || !scheduledResponse.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      const scheduledData = await scheduledResponse.json();

      setAppointments(data);
      setScheduledAppointments(scheduledData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }, []);

  const handleCancel = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        setScheduledAppointments(prev =>
          prev.filter(app => app._id !== appointmentId)
        );
        setPopupMessage('Appointment canceled successfully');
        setPopupOpen(true);
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setPopupMessage('Failed to cancel appointment');
      setPopupOpen(true);
    }
  };

  const isUpcoming = (appointmentDate: string, appointmentTime: string) => {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    return appointmentDateTime > new Date();
  };

  useEffect(() => {
    if (currentUser && currentUser.username) {  // Add check for username
      fetchAppointments({ username: currentUser.username });
    }
  }, [fetchAppointments, currentUser]);



  const handleAcceptDecline = async (appointmentId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
  
      if (response.ok) {
        if (action === 'decline') {
          // Remove the appointment from both arrays
          setAppointments(prev => prev.filter(app => app._id !== appointmentId));
          setScheduledAppointments(prev => prev.filter(app => app._id !== appointmentId));
        } else if (action === 'accept') {
          // Update the status in both arrays
          const updateAppointment = (prev: Appointment[]) =>
            prev.map(app =>
              app._id === appointmentId
                ? { ...app, currentStatus: 'approved' }
                : app
            );
          
          setAppointments(updateAppointment);
          setScheduledAppointments(updateAppointment);
        }
        setPopupMessage(`Appointment ${action}ed successfully`);
        setPopupOpen(true);
      } else {
        throw new Error(`Failed to ${action} appointment`);
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      setPopupMessage(`Failed to ${action} appointment`);
      setPopupOpen(true);
    }
  };

  const displayedAppointments = showAllAppointments
    ? appointments
    : appointments.slice(0, 8);

  return (
    <Container style={{ textAlign: 'center' }}>
      {/* Your Appointments Section */}
      <Typography variant="h4" gutterBottom>
        Your Appointments
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search your appointments..."
        value={receivedSearchTerm}
        onChange={(e) => setReceivedSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Paper sx={{ mb: 4 }}>
        <Tabs value={receivedTabValue} onChange={(_, newValue) => setReceivedTabValue(newValue)} centered>
          <Tab label="Upcoming" />
          <Tab label="Expired" />
        </Tabs>
      </Paper>

      <Grid container spacing={2}>
        {splitAppointments(filterAppointments(appointments, receivedSearchTerm))[receivedTabValue === 0 ? 'upcoming' : 'expired']
          .map((appointment) => (
            <Grid item xs={12} sm={6} lg={3} key={appointment._id}>
              <Card className={`${styles.appointmentCard} ${tabValue === 1 ? styles.expiredCard : ''}`}>
                <CardContent>
                  <Typography className={styles.cardTitle} variant="h6">
                    {appointment.title}
                  </Typography>
                  <Typography className={styles.cardDescription}>
                    {appointment.description}
                  </Typography>
                  <Typography className={styles.cardMeta}>
                    Date: {new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`).toLocaleString()}
                  </Typography>
                  <Typography className={`${styles.cardMeta} ${styles[`status${appointment.currentStatus}`]}`}>
                    Status: {appointment.currentStatus}
                  </Typography>
                  <Typography className={styles.cardMeta}>
                    Meeting With: {appointment.createdBy}
                  </Typography>
                  {appointment.voiceNote && (
                    <Box sx={{ mt: 1 }}>
                      <AudioPlayer base64Audio={appointment.voiceNote} />
                    </Box>
                  )}
                </CardContent>

                {appointment.currentStatus === 'pending' &&
                  appointment.appointmentWith === currentUser.username &&
                  isUpcoming(appointment.appointmentDate, appointment.appointmentTime) &&
                  receivedTabValue === 0 && (
                    <CardActions>
                      <Button
                        className={`${styles.actionButton} ${styles.acceptButton}`}
                        onClick={() => handleAcceptDecline(appointment._id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        className={`${styles.actionButton} ${styles.declineButton}`}
                        onClick={() => handleAcceptDecline(appointment._id, 'decline')}
                      >
                        Decline
                      </Button>
                    </CardActions>
                  )}
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Appointments You Scheduled Section */}
      <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
        Appointments You Scheduled
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search scheduled appointments..."
        value={scheduledSearchTerm}
        onChange={(e) => setScheduledSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Paper sx={{ mb: 4 }}>
        <Tabs value={scheduledTabValue} onChange={(_, newValue) => setScheduledTabValue(newValue)} centered>
          <Tab label="Upcoming" />
          <Tab label="Expired" />
        </Tabs>
      </Paper>

      <Grid container spacing={2}>
        {splitAppointments(filterAppointments(scheduledAppointments, scheduledSearchTerm))[scheduledTabValue === 0 ? 'upcoming' : 'expired']
          .map((appointment) => (
            <Grid item xs={12} sm={6} lg={3} key={appointment._id}>
              <Card className={`${styles.appointmentCard} ${scheduledTabValue === 1 ? styles.expiredCard : ''}`}>
                <CardContent>
                  <Typography className={styles.cardTitle} variant="h6">
                    {appointment.title}
                  </Typography>
                  <Typography className={styles.cardDescription}>
                    {appointment.description}
                  </Typography>
                  <Typography className={styles.cardMeta}>
                    Date: {new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`).toLocaleString()}
                  </Typography>
                  <Typography className={`${styles.cardMeta} ${styles[`status${appointment.currentStatus}`]}`}>
                    Status: {appointment.currentStatus}
                  </Typography>
                  <Typography className={styles.cardMeta}>
                    Scheduled for: {appointment.appointmentWith}
                  </Typography>
                  {appointment.voiceNote && (
                    <Box sx={{ mt: 1 }}>
                      <AudioPlayer base64Audio={appointment.voiceNote} />
                    </Box>
                  )}
                </CardContent>

                {appointment.currentStatus === 'pending' &&
                  isUpcoming(appointment.appointmentDate, appointment.appointmentTime) &&
                  scheduledTabValue === 0 && (
                    <CardActions>
                      <Button
                        className={`${styles.actionButton} ${styles.declineButton}`}
                        onClick={() => handleCancel(appointment._id)}
                        fullWidth
                      >
                        Cancel Appointment
                      </Button>
                    </CardActions>
                  )}
              </Card>
            </Grid>
          ))}
      </Grid>
      <Popup
        open={popupOpen}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </Container>
  );
}
