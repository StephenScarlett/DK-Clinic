import { Link } from 'react-router-dom'
import { useDashboardOverview, useSystemAlerts, useRecentActivity } from '../hooks/useDashboard'

function Dashboard() {
  // Fetch dashboard data using React Query
  const { data: overview, isLoading } = useDashboardOverview()
  const { data: alerts = [] } = useSystemAlerts()
  const { data: recentActivity } = useRecentActivity()

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-clinical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-gray-600 text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  // Fallback data for featured doctors when overview is not available
  const featuredDoctors = overview?.featuredDoctors || [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      image: "/doctor1.jpg",
      rating: 4.9,
      experience: "15 years"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Pediatrics",
      image: "/doctor2.jpg",
      rating: 4.8,
      experience: "12 years"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Dermatology",
      image: "/doctor3.jpg",
      rating: 4.9,
      experience: "10 years"
    }
  ]

  const stats = overview ? [
    { 
      label: 'Total Patients', 
      value: overview.patients.total, 
      color: '#9bc9d4', 
      icon: '👥', 
      bg: 'bg-medical-500',
      subtext: `${overview.patients.active} active`
    },
    { 
      label: 'Total Doctors', 
      value: overview.doctors.total, 
      color: '#9bc9d4', 
      icon: '👨‍⚕️', 
      bg: 'bg-medical-400',
      subtext: `${overview.doctors.available} available`
    },
    { 
      label: "Today's Appointments", 
      value: overview.appointments.today, 
      color: '#7bb5c2', 
      icon: '📅', 
      bg: 'bg-medical-300',
      subtext: `${overview.appointments.thisWeek} this week`
    },
    { 
      label: 'Pending Appointments', 
      value: overview.appointments.pending, 
      color: '#dac0bc', 
      icon: '⏳', 
      bg: 'bg-coral-400',
      subtext: `${overview.appointments.confirmed} confirmed`
    },
  ] : []

  const quickActions = [
    { name: 'Book Appointment', icon: '📅', color: 'bg-medical-500', link: '/book-appointment', desc: 'Schedule new patient visit' },
    { name: 'Add Patient', icon: '👤', color: 'bg-medical-400', link: '/patients', desc: 'Register new patient' },
    { name: 'View Reports', icon: '📊', color: 'bg-medical-300', link: '/appointments', desc: 'Check clinic analytics' },
    { name: 'Manage Doctors', icon: '👨‍⚕️', color: 'bg-coral-400', link: '/doctors', desc: 'Update staff information' }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-clinical-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-medical-500 rounded-3xl p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-5xl font-bold mb-4 text-white">
              Welcome to DK Clinic
            </h1>
            <p className="text-xl text-medical-100 mb-4">Advanced healthcare management at your fingertips</p>
            <div className="flex space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">🏥 Premium Care</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">⚡ Fast Service</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="/clinic-logo.svg" 
              alt="DK Clinic Logo" 
              className="w-32 h-32 opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold mb-1">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="text-medical-100 text-xs">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-medical-200/5 rounded-full -translate-y-48 -translate-x-48"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bg} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/90 font-medium">{stat.label}</div>
                {stat.subtext && (
                  <div className="text-white/70 text-sm mt-1">{stat.subtext}</div>
                )}
              </div>
              <div className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-8 bg-medical-500 rounded-full mr-4"></span>
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.link} 
              className={`${action.color} p-6 rounded-2xl text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl group`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                <div className="font-bold text-lg mb-2">{action.name}</div>
                <div className="text-white/80 text-sm">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Doctors */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-8 bg-medical-500 rounded-full mr-4"></span>
            Featured Doctors
          </h2>
          <Link to="/doctors" className="text-medical-600 hover:text-medical-700 font-semibold">View All →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group border border-gray-100">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-medical-100 shadow-lg group-hover:border-medical-300 transition-colors duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150x150/0ea5e9/FFFFFF?text=Dr'
                    }}
                  />
                  <div className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ⭐ {doctor.rating}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-medical-700 transition-colors duration-300">{doctor.name}</h3>
                <p className="text-gray-600 mb-4 font-medium">{doctor.specialization}</p>
                <div className="bg-medical-100 border border-medical-200 text-medical-700 px-4 py-2 rounded-xl font-semibold">
                  👥 {doctor.patients} patients
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-8 bg-medical-500 rounded-full mr-4"></span>
            Today's Appointments
          </h2>
          <Link to="/appointments" className="text-medical-600 hover:text-medical-700 font-semibold">View All →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="space-y-0">
            {recentActivity?.todayAppointments.map((appointment, index) => (
              <div key={appointment.id} className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-medical-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      📅
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{appointment.patient_name}</h3>
                      <p className="text-gray-600">{appointment.doctor_name}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                      appointment.type === 'Surgery' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.type}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <div className="p-12 text-center text-gray-500">
                <div className="text-4xl mb-4">📅</div>
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-8 bg-red-500 rounded-full mr-4"></span>
            System Alerts
          </h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'error' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                    <p className="text-gray-600">{alert.message}</p>
                  </div>
                  {alert.count && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                      alert.type === 'error' ? 'bg-red-200 text-red-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard