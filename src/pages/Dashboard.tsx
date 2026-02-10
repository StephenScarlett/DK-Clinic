import { Link } from 'react-router-dom'

function Dashboard() {
  const stats = [
    { label: 'Total Patients', value: 245, color: '#9bc9d4', icon: '👥', bg: 'bg-medical-500' },
    { label: 'Total Doctors', value: 12, color: '#9bc9d4', icon: '👨‍⚕️', bg: 'bg-medical-400' },
    { label: "Today's Appointments", value: 18, color: '#7bb5c2', icon: '📅', bg: 'bg-medical-300' },
    { label: 'Pending Appointments', value: 7, color: '#dac0bc', icon: '⏳', bg: 'bg-coral-400' },
  ]

  const featuredDoctors = [
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      specialization: 'Cardiologist', 
      rating: 4.9, 
      patients: 120,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 2, 
      name: 'Dr. Michael Chen', 
      specialization: 'Pediatrician', 
      rating: 4.8, 
      patients: 95,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 3, 
      name: 'Dr. Emily Rodriguez', 
      specialization: 'Dermatologist', 
      rating: 4.9, 
      patients: 88,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const quickActions = [
    { name: 'Book Appointment', icon: '📅', color: 'bg-medical-500', link: '/book-appointment', desc: 'Schedule new patient visit' },
    { name: 'Add Patient', icon: '👤', color: 'bg-medical-400', link: '/patients', desc: 'Register new patient' },
    { name: 'View Reports', icon: '📊', color: 'bg-medical-300', link: '/appointments', desc: 'Check clinic analytics' },
    { name: 'Manage Doctors', icon: '👨‍⚕️', color: 'bg-coral-400', link: '/doctors', desc: 'Update staff information' }
  ]

  const recentAppointments = [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '09:00 AM', status: 'Confirmed', priority: 'Normal' },
    { id: 2, patient: 'Jane Wilson', doctor: 'Dr. Johnson', time: '10:30 AM', status: 'Pending', priority: 'High' },
    { id: 3, patient: 'Mike Brown', doctor: 'Dr. Davis', time: '02:00 PM', status: 'Confirmed', priority: 'Normal' },
    { id: 4, patient: 'Sarah Miller', doctor: 'Dr. Wilson', time: '03:30 PM', status: 'Confirmed', priority: 'Urgent' },
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
            Recent Appointments
          </h2>
          <Link to="/appointments" className="text-medical-600 hover:text-medical-700 font-semibold">View All →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="space-y-0">
            {recentAppointments.map((appointment, index) => (
              <div key={appointment.id} className={`p-6 ${index !== recentAppointments.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-medical-50 transition-all duration-200 flex items-center justify-between group`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.priority === 'Urgent' ? 'bg-coral-500' :
                    appointment.priority === 'High' ? 'bg-coral-400' :
                    'bg-medical-500'
                  }`}></div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-medical-700 transition-colors duration-200">{appointment.patient}</div>
                    <div className="text-gray-600 text-sm">{appointment.doctor}</div>
                  </div>
                </div>
                <div className="text-gray-600 font-medium">{appointment.time}</div>
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  appointment.status === 'Confirmed' ? 'bg-medical-100 text-medical-800' :
                  appointment.status === 'Pending' ? 'bg-coral-100 text-coral-800' :
                  appointment.status === 'Completed' ? 'bg-medical-100 text-medical-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard