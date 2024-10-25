'use client';

import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { TextField, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
}

interface SidebarProps {
  currentUser: User;
  onUserSelect: (user: User) => void;
  onClose?: () => void;
}

export default function Sidebar({ currentUser, onUserSelect, onClose }: SidebarProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        const otherUsers = data.filter((user: User) => user.id !== currentUser?.id);
        setUsers(otherUsers);
        setFilteredUsers(otherUsers);
      } catch (error) {
        //console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Appointment Scheduler
        </Typography>
        {currentUser && (
          <Typography variant="subtitle1" className={styles.username}>
            {currentUser.username}
          </Typography>
        )}
      </div>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <br />  
      <p>Other Users</p>

      <List className={styles.userList}>
        {filteredUsers.map((user) => (
          <ListItem 
          key={user.id}
          onClick={() => onUserSelect(user)}
          className={styles.listItem}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemText 
            primary={user.username} 
            secondary={user.email}
          />
        </ListItem>
        ))}
      </List>
      <Button
        variant="text"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        className={styles.logoutButton}
        fullWidth
      >
        Logout
      </Button>
    </div>
  );
}