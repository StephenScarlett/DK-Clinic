import { useState } from 'react'
import { useDoctors, useCreateDoctor, useDeleteDoctor, useUpdateDoctorStatus, useDoctorStats } from '../hooks/useDoctors'
import { NewDoctor } from '../services/doctorService'

function Doctors() {
  // Fetch doctors data using React Query
  const { data: doctors = [], isLoading, error, refetch } = useDoctors()
  const { data: stats = { total: 0, available: 0, busy: 0, offDuty: 0, specializations: {} }, isLoading: statsLoading } = useDoctorStats()
  
  // Mutations
  const createDoctorMutation = useCreateDoctor()
  const deleteDoctorMutation = useDeleteDoctor()
  const updateStatusMutation = useUpdateDoctorStatus()

  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('')
  const [newDoctor, setNewDoctor] = useState<Omit<NewDoctor, 'id' | 'created_at' | 'updated_at' | 'status' | 'rating'>>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: 0,
    availability: []
  })

  // Get unique specializations from the available doctors for filtering
  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))]

  // Available days
  const availableDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization
    return matchesSearch && matchesSpecialization
  })

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createDoctorMutation.mutateAsync(newDoctor)
      
      // Reset form
      setNewDoctor({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: 0,
        availability: []
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to create doctor:', error)
      // You can add toast notification here
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor? This will also delete all their appointments.')) {
      try {
        await deleteDoctorMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete doctor:', error)
        // You can add toast notification here
      }
    }
  }

  const handleStatusChange = async (id: string, status: 'Available' | 'Busy' | 'Off Duty') => {
    try {
      await updateStatusMutation.mutateAsync({ id, status })
    } catch (error) {
      console.error('Failed to update doctor status:', error)
      // You can add toast notification here
    }
  }

  const handleAvailabilityChange = (day: string) => {
    setNewDoctor(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-medical-100 text-medical-800'
      case 'Busy': return 'bg-amber-100 text-amber-800'
      case 'Off Duty': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSpecializationIcon = (specialization: string) => {
    const icons: { [key: string]: string } = {
      'Cardiology': '❤️',
      'Dermatology': '🧴',
      'Pediatrics': '👶',
      'Orthopedics': '🦴',
      'Neurology': '🧠',
      'Gynecology': '🌸',
      'Psychiatry': '🧘',
      'General Medicine': '🏥',
      'Surgery': '🔪',
      'Emergency Medicine': '🚑',
      'Oncology': '🎗️',
      'Endocrinology': '⚗️'
    }
    return icons[specialization] || '👨‍⚕️'
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-clinical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-gray-600 text-lg">Loading doctors...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-clinical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-red-600 text-lg mb-4">Failed to load doctors</div>
          <div className="text-gray-600 mb-4">{error.message}</div>
          <button 
            onClick={() => refetch()}
            className="bg-medical-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 min-h-screen bg-clinical-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="w-2 h-12 bg-medical-500 rounded-full"></span>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Doctors</h1>
            <p className="text-gray-600">Manage your medical staff</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-medical-500 text-white' 
                  : 'text-gray-600 hover:text-medical-600'
              }`}
            >
              <span className="mr-2">⊞</span>Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-medical-500 text-white' 
                  : 'text-gray-600 hover:text-medical-600'
              }`}
            >
              <span className="mr-2">☰</span>List
            </button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-medical-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span className="text-xl">👨‍⚕️</span>
            <span>Add New Doctor</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <div className="flex space-x-4">
              <div className="bg-medical-100 px-4 py-2 rounded-xl">
                <span className="text-medical-700 font-medium">Total: {doctors.length}</span>
              </div>
              <div className="bg-medical-100 px-4 py-2 rounded-xl">
                <span className="text-medical-700 font-medium">Available: {doctors.filter(d => d.status === 'Available').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Doctor Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-medical-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">👨‍⚕️</span>
              Add New Doctor
            </h2>
          </div>
          <form onSubmit={handleAddDoctor} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter doctor's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="+1 234-567-8900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                <select
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={newDoctor.experience}
                  onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Years of experience"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                <input
                  type="text"
                  value={newDoctor.availability}
                  onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="e.g., Monday-Friday 9AM-5PM"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-medical-500 text-white rounded-xl hover:bg-medical-600 transition-all duration-200 font-semibold shadow-lg"
              >
                Add Doctor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={doctor.image || 'https://via.placeholder.com/150x150/14b8a6/FFFFFF?text=Dr'} 
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-medical-100 shadow-lg group-hover:border-medical-300 transition-colors duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x150/14b8a6/FFFFFF?text=Dr'
                      }}
                    />
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
                      doctor.status === 'Available' ? 'bg-medical-500' :
                      doctor.status === 'Busy' ? 'bg-amber-500' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-4 group-hover:text-medical-700 transition-colors duration-300">{doctor.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="text-lg">{getSpecializationIcon(doctor.specialization)}</span>
                    <span className="text-gray-600 font-medium">{doctor.specialization}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience:</span>
                    <span className="font-semibold text-gray-800">{doctor.experience} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold text-gray-800">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Patients:</span>
                    <span className="font-semibold text-gray-800">{doctor.patients}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doctor.status || 'Available')}`}>
                    {doctor.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <strong>Available:</strong> {doctor.availability}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 text-medical-600 hover:text-white hover:bg-medical-600 border border-medical-600 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="flex-1 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-medical-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3">👨‍⚕️</span>
                All Doctors
              </div>
              <span className="text-medical-100 text-sm">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Specialization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDoctors.map((doctor, index) => (
                  <tr key={doctor.id} className={`hover:bg-medical-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img 
                            src={doctor.image || 'https://via.placeholder.com/150x150/14b8a6/FFFFFF?text=Dr'} 
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/150x150/14b8a6/FFFFFF?text=Dr'
                            }}
                          />
                          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            doctor.status === 'Available' ? 'bg-medical-500' :
                            doctor.status === 'Busy' ? 'bg-amber-500' :
                            'bg-gray-400'
                          }`}></div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{doctor.name}</div>
                          <div className="text-sm text-gray-600">⭐ {doctor.rating} • {doctor.patients} patients</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-800">{doctor.email}</div>
                        <div className="text-gray-600">{doctor.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getSpecializationIcon(doctor.specialization)}</span>
                        <span className="font-medium text-gray-800">{doctor.specialization}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{doctor.experience} years</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doctor.status || 'Available')}`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-medical-600 hover:text-medical-700 text-sm font-medium py-1 px-2 rounded hover:bg-medical-50 transition-colors duration-200">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium py-1 px-2 rounded hover:bg-red-50 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <div className="text-gray-500 text-lg font-medium">No doctors found</div>
          <div className="text-gray-400 text-sm mt-2">
            {searchTerm || filterSpecialization ? 'Try adjusting your search criteria' : 'Add your first doctor to get started'}
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors