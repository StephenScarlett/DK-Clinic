import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Home', href: '/dashboard' },
  { name: 'Patients', href: '/patients' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Appointments', href: '/appointments' },
]

function TopNav() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-18">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="DK Clinic" 
                className="h-16 w-auto"
                onError={(e) => {
                  // Try fallback image path first
                  if (e.currentTarget.src.includes('/logo.png')) {
                    e.currentTarget.src = '/dk-clinic-logo.png';
                  } else {
                    // Show fallback logo if both images fail
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
              {/* Fallback logo */}
              <div 
                className="h-16 w-16 bg-gradient-to-br from-vibrant-teal-500 to-healthcare-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ display: 'none' }}
              >
                DK
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">DK Clinic</span>
              <p className="text-xs text-vibrant-teal-600 -mt-1 tracking-wider font-medium">Healthcare Excellence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-healthcare-600 border-b-2 border-healthcare-600'
                      : 'text-gray-600 hover:text-healthcare-600'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Book Appointment Button */}
          <Link
            to="/book-appointment"
            className="bg-healthcare-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-healthcare-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Book Appointment
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-healthcare-600 focus:outline-none focus:text-healthcare-600"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (hidden by default, would need state management to show) */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-6 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'text-healthcare-600 bg-healthcare-50'
                    : 'text-gray-600 hover:text-healthcare-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
          <Link
            to="/book-appointment"
            className="block w-full text-center bg-healthcare-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-healthcare-700 transition-colors duration-200 mt-4"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default TopNav