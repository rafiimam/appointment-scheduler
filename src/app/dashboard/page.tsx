'use client';

import AppointmentManagement from './AppointmentManagement';
import styles from './Dashboard.module.css';
import ScheduleAppointment from './ScheduleAppointment';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';

interface User {
  id: string;
  email: string;
  username: string;
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleUserSelect = (user: User) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };


  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflow: 'auto'
  };

  useEffect(() => {
    const getStoredUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser.username) {
            //console.error('Username is missing from stored user data');
            return;
          }
          setCurrentUser(parsedUser);
        } catch (error) {
          //console.error('Error parsing user data:', error);
        }
      } else {
        //console.log('No user data found in localStorage');
      }
    };
  
    if (typeof window !== 'undefined') {
      getStoredUser();
    }
  }, []);

  const handleSchedule = async (appointmentData: any) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...appointmentData,
          createdBy: currentUser?.username,
          currentStatus: 'pending'
        })
      });

      if (response.ok) {
        alert('Appointment scheduled successfully');
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to schedule appointment');
      }
    } catch (error) {
      //console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment');
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <IconButton
        sx={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1100,
          display: { xs: 'flex', md: 'none' },
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': { backgroundColor: '#f5f5f5' }
        }}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <MenuIcon sx={{ color: '#4834d4' }} />
      </IconButton>
        
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '280px',
            boxSizing: 'border-box',
          },
        }}
      >
        <Sidebar
          currentUser={currentUser}
          onUserSelect={(user) => {
            setSelectedUser(user);
            setIsModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </Drawer>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar currentUser={currentUser} onUserSelect={handleUserSelect} />
      </Box>
      <Box 
        sx={{ 
          marginLeft: { xs: 0, md: '280px' }, 
          flexGrow: 1,
          width: { xs: '100%', md: 'calc(100% - 280px)' }
        }} 
        className={styles.mainContent}
      >
        <AppointmentManagement currentUser={currentUser} />
        <ScheduleAppointment
          selectedUser={null}
          currentUser={currentUser}
          className={styles.scheduleCard}
        />
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(103, 58, 183, 0.1)',
            }
          }}
        >
          <Box sx={modalStyle}>
            <ScheduleAppointment
              selectedUser={selectedUser}
              currentUser={currentUser}
              isModal={true}
              onClose={() => setIsModalOpen(false)}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}