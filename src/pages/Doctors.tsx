import { useState } from 'react'
import { useDoctors } from '../hooks/useDoctors'
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  HeartIcon,
  BeakerIcon,
  CpuChipIcon,
  FaceSmileIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ScissorsIcon,
  WifiIcon,
  AcademicCapIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'

const Doctors = () => {
  const { data: doctors = [], isLoading: loading, error } = useDoctors()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: 0,
    availability: ''
  })

  const specializations = [
    'Cardiology',
    'Dermatology', 
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Psychiatry',
    'General Medicine',
    'Surgery',
    'Gynecology',
    'Radiology',
    'Pathology',
    'Emergency Medicine',
    'Oncology',
    'Endocrinology'
  ]

  // Enhanced doctors with mock data for modern design
  const enhancedDoctors = doctors.map((doctor, index) => ({
    ...doctor,
    rating: (4.2 + Math.random() * 0.8).toFixed(1),
    patients: Math.floor(150 + Math.random() * 300),
    image: `https://i.pravatar.cc/150?img=${index + 1}`,
    status: ['Available', 'Busy', 'Off Duty'][Math.floor(Math.random() * 3)]
  }))

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adding doctor:', newDoctor)
    setShowAddForm(false)
    setNewDoctor({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: 0,
      availability: ''
    })
  }

  const handleDeleteDoctor = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      console.log('Deleting doctor:', id)
    }
  }

  const filteredDoctors = enhancedDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization
    return matchesSearch && matchesSpecialization
  })

  // Get unique specializations from actual doctors
  const availableSpecializations = Array.from(new Set(enhancedDoctors.map(doctor => doctor.specialization))).sort()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-success-green-100 text-success-green-800'
      case 'Busy': return 'bg-bright-orange-100 text-bright-orange-800'
      case 'Off Duty': return 'bg-warm-gray-100 text-warm-gray-800'
      default: return 'bg-warm-gray-100 text-warm-gray-800'
    }
  }

  const getSpecializationIcon = (specialization: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'Cardiology': HeartIcon,
      'Dermatology': UserIcon,
      'Neurology': CpuChipIcon,
      'Pediatrics': FaceSmileIcon,
      'Orthopedics': WrenchScrewdriverIcon,
      'Psychiatry': CpuChipIcon,
      'General Medicine': UserIcon,
      'Surgery': ScissorsIcon,
      'Gynecology': UserIcon,
      'Radiology': WifiIcon,
      'Pathology': BeakerIcon,
      'Emergency Medicine': ExclamationTriangleIcon,
      'Oncology': BeakerIcon,
      'Endocrinology': BeakerIcon
    }
    return iconMap[specialization] || UserIcon
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50 flex items-center justify-center">
        <div className="text-center modern-card">
          <div className="mb-4 flex justify-center">
            <UserGroupIcon className="w-16 h-16 text-healthcare-600 animate-pulse" />
          </div>
          <div className="text-warm-gray-600 text-lg">Loading our medical team...</div>
          <div className="mt-4 w-64 h-2 bg-warm-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-healthcare-500 to-vibrant-teal-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50 flex items-center justify-center">
        <div className="text-center modern-card">
          <div className="mb-4 flex justify-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />
          </div>
          <div className="text-red-600 text-xl font-semibold mb-4">Failed to load doctors</div>
          <div className="text-warm-gray-600 mb-6">{error.message}</div>
          <button className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50">
      {/* Modern Header */}
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h1 className="text-6xl font-bold text-warm-gray-900 mb-6">
              Our Medical <span className="text-healthcare-600">Team</span>
            </h1>
            <p className="text-xl text-warm-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet our world-class healthcare professionals dedicated to providing exceptional medical care and treatment.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Total Doctors */}
            <div className="modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-healthcare-100 to-healthcare-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-healthcare-500 to-healthcare-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserGroupIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-healthcare-700 mb-1">{filteredDoctors.length}</div>
                      <div className="text-xs text-healthcare-500 font-medium">TOTAL</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-2">Total Doctors</h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">Qualified medical professionals on our team</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-healthcare-400 to-healthcare-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Available Now */}
            <div className="modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{animationDelay: '0.1s'}}>
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success-green-100 to-success-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-success-green-500 to-success-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-success-green-700 mb-1">{filteredDoctors.filter(d => d.status === 'Available').length}</div>
                      <div className="text-xs text-success-green-500 font-medium">AVAILABLE</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-2">Available Now</h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">Doctors currently available for consultations</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-success-green-400 to-success-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Specializations */}
            <div className="modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{animationDelay: '0.2s'}}>
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vibrant-teal-100 to-vibrant-teal-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-vibrant-teal-500 to-vibrant-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <AcademicCapIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-vibrant-teal-700 mb-1">{new Set(filteredDoctors.map(d => d.specialization)).size}</div>
                      <div className="text-xs text-vibrant-teal-500 font-medium">SPECIALIZATIONS</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-2">Specializations</h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">Different medical specialties available in our clinic</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-vibrant-teal-400 to-vibrant-teal-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="modern-card mb-12 fade-in">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="w-4 h-4 text-warm-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-warm-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent transition-all duration-200 text-sm h-10"
                />
              </div>
              
              <div className="flex items-center">
                <select
                  value={filterSpecialization}
                  onChange={(e) => setFilterSpecialization(e.target.value)}
                  className="px-3 py-2.5 border border-warm-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent transition-all duration-200 text-sm h-10"
                >
                  <option value="">All Specializations</option>
                  {availableSpecializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-warm-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-healthcare-600 text-white shadow-sm'
                      : 'text-warm-gray-600 hover:text-warm-gray-800'
                  }`}
                  title="Grid view"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-healthcare-600 text-white shadow-sm'
                      : 'text-warm-gray-600 hover:text-warm-gray-800'
                  }`}
                  title="List view"
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-3 py-2.5 bg-healthcare-600 text-white hover:bg-healthcare-700 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 text-sm h-10"
              >
                <PlusIcon className="w-4 h-4" />
                Add New Doctor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-healthcare-600 p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <UserGroupIcon className="w-8 h-8" />
                  Add New Doctor
                </h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-white hover:text-healthcare-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    placeholder="Enter doctor's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    placeholder="doctor@dkclinic.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Specialization</label>
                  <select
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) })}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    placeholder="10"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Availability</label>
                  <input
                    type="text"
                    value={newDoctor.availability}
                    onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    placeholder="Mon-Fri 9AM-5PM"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-warm-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-4 border-2 border-warm-gray-200 text-warm-gray-600 rounded-2xl hover:bg-warm-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-4 bg-healthcare-600 text-white rounded-2xl hover:bg-healthcare-700 transition-all duration-200 font-semibold shadow-lg"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors Display */}
      <div className="px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => {
              const SpecIcon = getSpecializationIcon(doctor.specialization)
              return (
              <div key={doctor.id || index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden slide-up" style={{animationDelay: `${index * 0.05}s`}}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-healthcare-100/30 to-transparent rounded-full -translate-y-6 translate-x-6 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-vibrant-teal-100/20 to-transparent rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className="relative z-10 p-6">
                  {/* Doctor Header */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <img 
                        src={doctor.image || `https://via.placeholder.com/150x150/2563eb/FFFFFF?text=Dr`} 
                        alt={doctor.name || 'Doctor'}
                        className="w-20 h-20 rounded-full object-cover border-4 border-healthcare-100 shadow-lg group-hover:border-healthcare-300 transition-colors duration-300"
                      />
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
                        doctor.status === 'Available' ? 'bg-success-green-500' : doctor.status === 'Busy' ? 'bg-bright-orange-500' : 'bg-warm-gray-400'
                      }`}></div>
                    </div>
                    <h3 className="text-xl font-bold text-warm-gray-900 mt-4 group-hover:text-healthcare-700 transition-colors duration-300">{doctor.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <SpecIcon className="w-5 h-5 text-healthcare-600" />
                      <span className="text-warm-gray-600 font-medium">{doctor.specialization}</span>
                    </div>
                  </div>
                  
                  {/* Doctor Details */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-healthcare-50 to-healthcare-100/50 rounded-lg p-3 group-hover:from-healthcare-100 group-hover:to-healthcare-200/50 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-healthcare-700">Experience:</span>
                        <span className="font-bold text-warm-gray-800">{doctor.experience} years</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-vibrant-teal-50 to-vibrant-teal-100/50 rounded-lg p-3 group-hover:from-vibrant-teal-100 group-hover:to-vibrant-teal-200/50 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-vibrant-teal-700">Rating:</span>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-warm-gray-800">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doctor.status || 'Available')}`}>
                      <span className={`w-2 h-2 rounded-full ${
                        doctor.status === 'Available' ? 'bg-success-green-500' : doctor.status === 'Busy' ? 'bg-bright-orange-500' : 'bg-warm-gray-400'
                      }`}></span>
                      {doctor.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-healthcare-600 text-white py-2.5 px-3 rounded-lg font-medium hover:bg-healthcare-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 text-sm">
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteDoctor(doctor.id || '')}
                      className="bg-red-600 text-white py-2.5 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
            })}
            </div>
          ) : (
            <div className="modern-card space-y-0 divide-y divide-warm-gray-100">
              {filteredDoctors.map((doctor, index) => {
                const SpecIcon = getSpecializationIcon(doctor.specialization)
                return (
                <div key={doctor.id || index} className="p-4 hover:bg-warm-gray-50 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={doctor.image || `https://via.placeholder.com/150x150/2563eb/FFFFFF?text=Dr`} 
                          alt={doctor.name || 'Doctor'}
                          className="w-10 h-10 rounded-full object-cover border-2 border-healthcare-100 shadow-sm"
                        />
                        <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                          doctor.status === 'Available' ? 'bg-success-green-500' : doctor.status === 'Busy' ? 'bg-bright-orange-500' : 'bg-warm-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base font-semibold text-warm-gray-900 group-hover:text-healthcare-700 transition-colors duration-200">
                            {doctor.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            doctor.status === 'Available' ? 'bg-success-green-100 text-success-green-800' :
                            doctor.status === 'Busy' ? 'bg-bright-orange-100 text-bright-orange-800' :
                            'bg-warm-gray-100 text-warm-gray-800'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              doctor.status === 'Available' ? 'bg-success-green-500' : doctor.status === 'Busy' ? 'bg-bright-orange-500' : 'bg-warm-gray-400'
                            }`}></span>
                            {doctor.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-warm-gray-600">
                          <div className="flex items-center gap-1">
                            <SpecIcon className="w-3.5 h-3.5 text-healthcare-600" />
                            <span className="font-medium">{doctor.specialization}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5 text-vibrant-teal-600" />
                            <span>{doctor.experience} years</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                            <span className="font-medium">{doctor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-healthcare-600 hover:bg-healthcare-50 rounded-lg transition-all duration-200">
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-warm-gray-600 hover:bg-warm-gray-100 rounded-lg transition-all duration-200">
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDoctor(doctor.id || '')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}

          {filteredDoctors.length === 0 && (
            <div className="modern-card text-center py-16">
              <div className="mb-6 flex justify-center">
                <UserGroupIcon className="w-16 h-16 text-warm-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-warm-gray-700 mb-4">
                {searchTerm || filterSpecialization ? 'No doctors found' : 'No doctors yet'}
              </h3>
              <p className="text-warm-gray-500 mb-8">
                {searchTerm || filterSpecialization
                  ? "Try adjusting your search criteria or filter settings" 
                  : "Add your first doctor to get started with team management"}
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-healthcare-600 text-white hover:bg-healthcare-700 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add First Doctor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors

