import { Link } from 'react-router-dom'
import { useDashboardOverview, useSystemAlerts, useRecentActivity } from '../hooks/useDashboard'
import { 
  HeartIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  BoltIcon,
  TrophyIcon,
  UserGroupIcon,
  BeakerIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  InformationCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline'

function Dashboard() {
  // Fetch dashboard data using React Query
  const { data: overview, isLoading } = useDashboardOverview()
  const { data: alerts = [] } = useSystemAlerts()
  const { data: recentActivity } = useRecentActivity()

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50 flex items-center justify-center">
        <div className="text-center modern-card">
          <div className="mb-4 flex justify-center">
            <BuildingOffice2Icon className="w-16 h-16 text-healthcare-600 animate-pulse" />
          </div>
          <div className="text-warm-gray-600 text-lg">Loading your dashboard...</div>
          <div className="mt-4 w-64 h-2 bg-warm-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-healthcare-500 to-vibrant-teal-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // DK Clinic Healthcare Services
  const healthcareServices = [
    {
      title: "General Medicine",
      description: "Comprehensive primary care and routine health checkups",
      icon: HeartIcon,
      bg: "gradient-bg-2",
      link: "/appointments"
    },
    {
      title: "Specialized Care", 
      description: "Expert specialists for cardiology, orthopedics, and more",
      icon: BuildingOffice2Icon,
      bg: "gradient-bg-3",
      link: "/doctors"
    },
    {
      title: "Emergency Services",
      description: "24/7 emergency care for urgent medical situations",
      icon: ExclamationTriangleIcon,
      bg: "gradient-bg-5",
      link: "/book-appointment"
    },
    {
      title: "Easy Scheduling",
      description: "Book appointments online or call our friendly staff",
      icon: CalendarDaysIcon, 
      bg: "gradient-bg-4",
      link: "/book-appointment"
    }
  ]

  // DK Clinic featured doctors
  const featuredDoctors = overview?.featuredDoctors || [
    {
      id: 1,
      name: "Dr. Kathy Williams",
      specialization: "Family Medicine",
      image: "/doctor1.jpg",
      rating: 4.9,
      experience: "15 years",
      color: "healthcare"
    },
    {
      id: 2,
      name: "Dr. James Rodriguez", 
      specialization: "General Medicine",
      image: "/doctor2.jpg",
      rating: 4.8,
      experience: "12 years",
      color: "vibrant-teal"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Dermatology", 
      image: "/doctor3.jpg",
      rating: 4.9,
      experience: "10 years",
      color: "medical-purple"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialization: "Orthopedics",
      image: "/doctor4.jpg", 
      rating: 4.7,
      experience: "18 years",
      color: "bright-orange"
    },
    {
      id: 5,
      name: "Dr. Lisa Zhang",
      specialization: "Neurology",
      image: "/doctor5.jpg",
      rating: 4.8,
      experience: "14 years", 
      color: "success-green"
    },
    {
      id: 6,
      name: "Dr. David Brown",
      specialization: "Psychiatry",
      image: "/doctor6.jpg",
      rating: 4.9,
      experience: "16 years",
      color: "medical-purple"
    }
  ]

  const quickStats = overview ? [
    { 
      label: 'Total Patients', 
      value: overview.patients.total, 
      icon: UserGroupIcon, 
      bg: 'gradient-bg-1',
      subtext: `${overview.patients.active} active patients`
    },
    { 
      label: 'Total Doctors', 
      value: overview.doctors.total, 
      icon: UserIcon, 
      bg: 'gradient-bg-2',
      subtext: `${overview.doctors.available} available today`
    },
    { 
      label: "Today's Appointments", 
      value: overview.appointments.today, 
      icon: CalendarDaysIcon, 
      bg: 'gradient-bg-3',
      subtext: `${overview.appointments.thisWeek} this week`
    },
    { 
      label: 'Happy Clients', 
      value: overview.appointments.confirmed, 
      icon: StarIcon, 
      bg: 'gradient-bg-4',
      subtext: `${Math.round(overview.patients.active * 0.95)}% satisfaction rate`
    },
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-healthcare-600 via-healthcare-700 to-vibrant-teal-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-vibrant-teal-400/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        {/* Medical Background Images */}
        <div className="absolute top-20 left-1/4 w-32 h-32 opacity-10 transform rotate-12">
          <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center">
            <HeartIcon className="w-16 h-16 text-white" />
          </div>
        </div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 opacity-15 transform -rotate-12">
          <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
            <BeakerIcon className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="absolute top-1/2 right-10 w-28 h-28 opacity-10 transform rotate-45">
          <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center">
            <BuildingOffice2Icon className="w-14 h-14 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white fade-in">
                <h1 className="text-6xl font-bold mb-6 leading-tight">
                  Welcome to <span className="text-vibrant-teal-300">DK Clinic</span>
                  <br />Your Healthcare <span className="text-coral-300">Partner</span>
                </h1>
                <p className="text-xl text-healthcare-100 mb-8 leading-relaxed">
                  Experience exceptional healthcare with our dedicated team of medical professionals. 
                  From routine check-ups to specialized treatments, we're here to care for you and your family 
                  with compassion, expertise, and state-of-the-art medical technology.
                </p>
                
                {/* Clinic Important Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-2 text-vibrant-teal-200 text-sm font-medium mb-1">
                      <PhoneIcon className="w-4 h-4" />
                      <span>Call Us</span>
                    </div>
                    <div className="text-white font-bold">(555) 123-4567</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-2 text-vibrant-teal-200 text-sm font-medium mb-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>Hours</span>
                    </div>
                    <div className="text-white font-bold">Mon-Fri 8AM-6PM</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-2 text-vibrant-teal-200 text-sm font-medium mb-1">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span>Emergency</span>
                    </div>
                    <div className="text-white font-bold">24/7 Available</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/book-appointment" 
                    className="btn-modern bg-bright-orange-500 text-white hover:bg-bright-orange-600 inline-flex items-center justify-center gap-3"
                  >
                    <CalendarDaysIcon className="w-5 h-5" />
                    Schedule Your Visit
                  </Link>
                  <Link 
                    to="/doctors" 
                    className="btn-modern bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 inline-flex items-center justify-center gap-3"
                  >
                    <UserGroupIcon className="w-5 h-5" />
                    Meet Our Team
                  </Link>
                </div>
              </div>
              
              <div className="relative slide-up">
                {/* Healthcare Promise Cards */}
                <div className="space-y-6">
                  {/* Why Choose DK Clinic */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                    <h3 className="text-white font-bold text-2xl mb-6 text-center">
                      ✨ Why Choose DK Clinic?
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="mb-3">
                          <BoltIcon className="w-12 h-12 text-bright-orange-400 mx-auto" />
                        </div>
                        <div className="text-vibrant-teal-200 font-medium">Same-Day</div>
                        <div className="text-white text-sm">Appointments</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-3">
                          <TrophyIcon className="w-12 h-12 text-bright-orange-400 mx-auto" />
                        </div>
                        <div className="text-vibrant-teal-200 font-medium">Expert Care</div>
                        <div className="text-white text-sm">Board Certified</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-3">
                          <UserGroupIcon className="w-12 h-12 text-bright-orange-400 mx-auto" />
                        </div>
                        <div className="text-vibrant-teal-200 font-medium">Personal Touch</div>
                        <div className="text-white text-sm">Family Focused</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-3">
                          <BeakerIcon className="w-12 h-12 text-bright-orange-400 mx-auto" />
                        </div>
                        <div className="text-vibrant-teal-200 font-medium">Modern Tech</div>
                        <div className="text-white text-sm">Latest Equipment</div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Testimonial */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                    <div className="text-center">
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-6 h-6 text-bright-orange-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-white italic text-lg leading-relaxed mb-4">
                        "DK Clinic has been caring for my family for over 5 years. The doctors are compassionate, 
                        the staff is friendly, and they always make time for us when we need them most."
                      </blockquote>
                      <div className="text-vibrant-teal-200 font-medium">— Sarah M., Long-time Patient</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Medical Images Section */}
      <div className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-warm-gray-800 mb-4">
              Comprehensive <span className="text-healthcare-600">Healthcare Services</span>
            </h2>
            <p className="text-xl text-warm-gray-600 max-w-3xl mx-auto">
              From preventive care to specialized treatments, our medical team provides personalized healthcare solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {healthcareServices.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    <service.icon className="w-16 h-16 text-healthcare-600" />
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-warm-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 text-healthcare-600 font-medium group-hover:text-healthcare-700">
                    Learn More →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Support Information Section */}
      <div className="bg-white py-16 px-8 border-t border-warm-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-warm-gray-800 mb-6 flex items-center justify-center lg:justify-start gap-3">
                <PhoneIcon className="w-6 h-6 text-healthcare-600" />
                Contact DK Clinic
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-vibrant-teal-600 font-medium">Phone:</span>
                  <span className="text-warm-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-vibrant-teal-600 font-medium">Email:</span>
                  <span className="text-warm-gray-700">info@dkclinic.com</span>
                </div>
                <div className="flex items-start justify-center lg:justify-start gap-3">
                  <span className="text-vibrant-teal-600 font-medium">Address:</span>
                  <div className="text-warm-gray-700">
                    123 Health Street<br/>
                    Medical District<br/>
                    City, State 12345
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic Hours */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-warm-gray-800 mb-6 flex items-center justify-center lg:justify-start gap-3">
                <ClockIcon className="w-6 h-6 text-healthcare-600" />
                Operating Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center max-w-sm mx-auto lg:mx-0">
                  <span className="text-warm-gray-700">Monday - Friday</span>
                  <span className="font-medium text-warm-gray-800">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center max-w-sm mx-auto lg:mx-0">
                  <span className="text-warm-gray-700">Saturday</span>
                  <span className="font-medium text-warm-gray-800">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center max-w-sm mx-auto lg:mx-0">
                  <span className="text-warm-gray-700">Sunday</span>
                  <span className="font-medium text-warm-gray-800">Emergency Only</span>
                </div>
                <div className="mt-6 p-4 bg-healthcare-50 rounded-xl">
                  <div className="flex items-center gap-2 text-healthcare-700 font-bold text-sm">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    24/7 Emergency Care Available
                  </div>
                  <div className="text-healthcare-600 text-sm mt-1">Call emergency line: (555) 911-HELP</div>
                </div>
              </div>
            </div>

            {/* Quick Links & Support */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-warm-gray-800 mb-6 flex items-center justify-center lg:justify-start gap-3">
                <InformationCircleIcon className="w-6 h-6 text-healthcare-600" />
                Patient Support
              </h3>
              <div className="space-y-4">
                <Link
                  to="/book-appointment"
                  className="block p-3 bg-healthcare-50 hover:bg-healthcare-100 rounded-xl text-healthcare-700 font-medium transition-colors flex items-center gap-2"
                >
                  <CalendarDaysIcon className="w-4 h-4" />
                  Book an Appointment
                </Link>
                <Link
                  to="/patients"
                  className="block p-3 bg-vibrant-teal-50 hover:bg-vibrant-teal-100 rounded-xl text-vibrant-teal-700 font-medium transition-colors flex items-center gap-2"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Patient Portal
                </Link>
                <Link
                  to="/doctors"
                  className="block p-3 bg-medical-purple-50 hover:bg-medical-purple-100 rounded-xl text-medical-purple-700 font-medium transition-colors flex items-center gap-2"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Meet Our Doctors
                </Link>
                <div className="mt-6 p-4 bg-warm-gray-50 rounded-xl">
                  <div className="text-warm-gray-700 text-sm">
                    <strong>Need Help?</strong><br/>
                    Our friendly staff is here to assist you with scheduling, insurance questions, and medical inquiries.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-warm-gray-200 mt-6 pt-4">
            <div className="flex justify-center mb-2">
              <img 
                src="/logo.png" 
                alt="DK Clinic - Healthcare Excellence" 
                className="h-32 w-auto opacity-90"
                onError={(e) => {
                  if (e.currentTarget.src.includes('/logo.png')) {
                    e.currentTarget.src = '/dk-clinic-logo.png';
                  } else {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            </div>
            <div className="text-center">
              <div className="text-warm-gray-600 text-sm">
                © 2026 DK Clinic. All rights reserved. | Providing quality healthcare since 2010.
              </div>
              <div className="text-warm-gray-500 text-xs mt-2">
                Licensed Healthcare Provider | Medical Board Certified | HIPAA Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard