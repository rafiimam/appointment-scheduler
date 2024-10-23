// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule'; 
import { AppointmentProvider } from './context/AppointmentContext'; // Import the AppointmentProvider
import './App.css';

function App() {
  return (
    <Router>
      <AppointmentProvider> {/* Wrap your routes with AppointmentProvider */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </AppointmentProvider>
    </Router>
  );
}

export default App;
