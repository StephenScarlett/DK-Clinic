import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Patients', href: '/patients', icon: '👥' },
  { name: 'Doctors', href: '/doctors', icon: '👨‍⚕️' },
  { name: 'Appointments', href: '/appointments', icon: '📅' },
  { name: 'Book Appointment', href: '/book-appointment', icon: '➕' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-medical-600 shadow-xl z-50">
      <div className="flex flex-col h-full">
        {/* Header with Logo */}
        <div className="flex items-center justify-center h-20 bg-medical-500 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center relative">
              <div className="absolute inset-1 bg-coral-400 rounded-lg"></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-white font-black text-xs leading-none">DK</span>
                <div className="w-3 h-0.5 bg-white rounded-full mt-0.5"></div>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white tracking-wide">DK Clinic</h1>
              <p className="text-medical-100 text-xs">Healthcare Excellence</p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="px-6 py-4 border-b border-medical-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-coral-400/30 rounded-full flex items-center justify-center border border-white/20">
              <span className="text-lg font-bold text-coral-200">👨‍⚕️</span>
            </div>
            <div>
              <p className="text-white font-medium">Dr. Admin</p>
              <p className="text-medical-200 text-sm">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-medical-700 text-white shadow-md' 
                    : 'text-medical-200 hover:text-healthcare-600 hover:bg-healthcare-50/20'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-coral-400/15"></div>
                )}
                <span className={`text-xl mr-4 transition-transform duration-300 relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
                  {item.icon}
                </span>
                <span className="font-medium relative z-10">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm relative z-10"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 bg-medical-500 border-t border-medical-400">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-medical-200">
              <div className="w-2 h-2 bg-medical-400 rounded-full animate-pulse"></div>
              <span className="text-sm">System Online</span>
            </div>
            <p className="text-xs text-medical-300">DK Clinic v2.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar