# DK Clinic Management System

A modern, responsive React TypeScript application for managing a private clinic. This system allows you to efficiently manage patients, doctors, and appointments with an intuitive user interface.

## Features

### 📊 Dashboard
- Overview of key statistics
- Recent appointments summary
- Quick access to all main features

### 👥 Patient Management
- Add, view, and manage patient records
- Store patient contact information and medical details
- Search and filter patient database

### 👨‍⚕️ Doctor Management
- Maintain doctor profiles with specializations
- Track doctor availability and schedules
- Manage doctor contact information

### 📅 Appointment System
- Book new appointments with available doctors
- View and filter appointments by status and date
- Update appointment status (Pending → Confirmed → Completed)
- Cancel appointments when needed

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS with custom design system
- **Development**: ESLint for code quality

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DKClinic
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Code Quality

Run ESLint to check code quality:
```bash
npm run lint
# or
yarn lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── Sidebar.css     # Sidebar styles
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Patients.tsx    # Patient management
│   ├── Doctors.tsx     # Doctor management
│   ├── Appointments.tsx # Appointment viewing
│   └── BookAppointment.tsx # Appointment booking
├── App.tsx             # Main application component
├── App.css             # Global application styles
├── main.tsx            # Application entry point
└── index.css           # Base styles
```

## Features Overview

### Navigation
- Clean sidebar navigation with icons
- Active page highlighting
- Responsive design for mobile devices

### Data Management
- Local state management with React hooks
- Form validation for data integrity
- CRUD operations for all entities

### User Interface
- Modern, clean design
- Responsive layout for all screen sizes
- Intuitive forms and data tables
- Status indicators for appointments

## Future Enhancements

- Backend API integration
- Database persistence
- User authentication and authorization
- Email notifications for appointments
- Calendar view for appointments
- Print functionality for reports
- Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the GitHub repository.

## Images
<img width="1886" height="1026" alt="image" src="https://github.com/user-attachments/assets/f6aa330c-1bba-4b9d-924a-2a1b80bec54c" />
<img width="1894" height="996" alt="image" src="https://github.com/user-attachments/assets/63e884e7-be59-4b67-be58-6b11b2532fa4" />


