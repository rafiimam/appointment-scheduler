# Appointment Scheduler

A full-stack web application built with Next.js and MongoDB that allows users to schedule, manage, and track appointments with other users.

## Features

- User authentication (Register/Login)
- Real-time appointment management
- Voice note attachments
- Search functionality
- Appointment status tracking (pending, approved, declined)
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/appointment-scheduler.git
cd appointment-scheduler
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```


## Usage Guide

### 1. User Registration and Login
- Navigate to the registration page
- Create an account with username and password
- Log in using your credentials

### 2. Dashboard Overview
After logging in, you'll see two main sections:
- **Your Appointments**: Appointments others have scheduled with you
- **Appointments You Scheduled**: Appointments you've created

### 3. Scheduling an Appointment
1. Open the sidebar by clicking the menu icon
2. Search for a user you want to schedule with
3. Click on the user to open the scheduling modal
4. Fill in required fields:
   - Title
   - Description
   - Date
   - Time
5. Optionally record a voice note
6. Click "Schedule" to create the appointment

### 4. Managing Appointments

#### For Received Appointments:
- **Accept**: Approve pending appointments
- **Decline**: Reject appointments
- View appointment details including voice notes

#### For Scheduled Appointments:
- **Cancel**: Cancel appointments before they expire
- Track status (pending, approved, declined)

### 5. Search and Filter
- Use the search bar to find appointments by title or description
- Toggle between "Upcoming" and "Expired" appointments
- View all appointments in a organized grid layout

## Technical Stack

- **Frontend**: Next.js, Material-UI, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Custom implementation
- **State Management**: React Hooks
- **Styling**: CSS Modules

## API Endpoints

- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User authentication
- `GET /api/appointments`: Fetch user's appointments
- `POST /api/appointments`: Create new appointment
- `PATCH /api/appointments/:id`: Update appointment status
- `GET /api/appointments/scheduled`: Fetch scheduled appointments

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
