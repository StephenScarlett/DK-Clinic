import { useState } from 'react'
import { usePatients, useCreatePatient, useDeletePatient, usePatientStats } from '../hooks/usePatients'
import { NewPatient } from '../services/patientService'
import {
  UsersIcon,
  CheckCircleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CakeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'

function Patients() {
  // Fetch patients data using React Query
  const { data: patients = [], isLoading, error, refetch } = usePatients()
  const { data: stats = { total: 0, active: 0, inactive: 0 }, isLoading: statsLoading } = usePatientStats()
  
  // Mutations
  const createPatientMutation = useCreatePatient()
  const deletePatientMutation = useDeletePatient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile')
  const [newPatient, setNewPatient] = useState<Omit<NewPatient, 'id' | 'created_at' | 'updated_at' | 'status'>>({
    name: '',
    email: '',
    phone: '',
    age: 0,
    gender: '',
    address: ''
  })

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createPatientMutation.mutateAsync(newPatient)
      
      // Reset form
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        age: 0,
        gender: '',
        address: ''
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to create patient:', error)
      // You can add toast notification here
    }
  }

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatientMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete patient:', error)
        // You can add toast notification here
      }
    }
  }

  const getPatientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-healthcare-500',
      'bg-vibrant-teal-500', 
      'bg-medical-purple-500',
      'bg-bright-orange-500',
      'bg-success-green-500'
    ]
    return colors[index % colors.length]
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50 flex items-center justify-center">
        <div className="text-center modern-card">
          <div className="mb-4 flex justify-center">
            <UsersIcon className="w-16 h-16 text-healthcare-600 animate-pulse" />
          </div>
          <div className="text-warm-gray-600 text-lg">Loading patients...</div>
          <div className="mt-4 w-64 h-2 bg-warm-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-healthcare-500 to-vibrant-teal-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50 flex items-center justify-center">
        <div className="text-center modern-card">
          <div className="mb-4 flex justify-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />
          </div>
          <div className="text-red-600 text-xl font-semibold mb-4">Failed to load patients</div>
          <div className="text-warm-gray-600 mb-6">{error.message}</div>
          <button 
            onClick={() => refetch()}
            className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700"
          >
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
              Patient <span className="text-healthcare-600">Management</span>
            </h1>
            <p className="text-xl text-warm-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive patient records and healthcare management system for exceptional care delivery.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Total Patients */}
            <div className="modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-healthcare-100 to-healthcare-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-healthcare-500 to-healthcare-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UsersIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-healthcare-700 mb-1">{stats.total}</div>
                      <div className="text-xs text-healthcare-500 font-medium">TOTAL</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-2">Total Patients</h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">Registered in our comprehensive healthcare system</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-healthcare-400 to-healthcare-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Active Patients */}
            <div className="modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{animationDelay: '0.1s'}}>
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success-green-100 to-success-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-success-green-500 to-success-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-success-green-700 mb-1">{stats.active}</div>
                      <div className="text-xs text-success-green-500 font-medium">ACTIVE</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-2">Active Patients</h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">Currently receiving ongoing medical care and treatment</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-success-green-400 to-success-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Activity Rate */}
            <div className="modern-card bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{animationDelay: '0.2s'}}>
              <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vibrant-teal-100 to-vibrant-teal-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-vibrant-teal-500 to-vibrant-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <ChartBarIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-vibrant-teal-700 mb-1">{Math.round((stats.active / stats.total) * 100) || 0}%</div>
                      <div className="text-xs text-vibrant-teal-500 font-medium">RATE</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray-800 mb-2">Activity Rate</h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">Patient engagement and participation in healthcare programs</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-vibrant-teal-400 to-vibrant-teal-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="modern-card mb-12 fade-in">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-warm-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-warm-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent transition-all duration-200 text-base"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex rounded-xl bg-warm-gray-100 p-1">
                <button
                  onClick={() => setViewMode('tile')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm ${
                    viewMode === 'tile' 
                      ? 'bg-healthcare-600 text-white shadow-lg' 
                      : 'text-warm-gray-600 hover:text-healthcare-600'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">Tiles</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 ml-1 text-sm ${
                    viewMode === 'list' 
                      ? 'bg-healthcare-600 text-white shadow-lg' 
                      : 'text-warm-gray-600 hover:text-healthcare-600'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-3 bg-healthcare-600 text-white hover:bg-healthcare-700 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add New Patient
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Display */}
      <div className="px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredPatients.length > 0 ? (
            viewMode === 'tile' ? (
              /* Tile View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient, index) => (
                  <div key={patient.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden slide-up" style={{animationDelay: `${index * 0.05}s`}}>
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-healthcare-100/30 to-transparent rounded-full -translate-y-6 translate-x-6 group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-vibrant-teal-100/20 to-transparent rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 p-6">
                      {/* Patient Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-14 h-14 rounded-xl ${getAvatarColor(index)} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                              <span className="text-white text-lg font-bold">{getPatientInitials(patient.name)}</span>
                            </div>
                            <div className="absolute -top-1 -right-1">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                patient.status === 'active' 
                                  ? 'bg-success-green-500 text-white' 
                                  : 'bg-warm-gray-400 text-white'
                              }`}>
                                {patient.status === 'active' ? '●' : '○'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-warm-gray-900 mb-1 group-hover:text-healthcare-700 transition-colors">{patient.name}</h3>
                            <p className="text-warm-gray-500 text-xs font-mono">#{patient.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Patient Details Grid */}
                      <div className="space-y-4 mb-6">
                        {/* Age & Gender Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-r from-healthcare-50 to-healthcare-100/50 rounded-lg p-2.5 group-hover:from-healthcare-100 group-hover:to-healthcare-200/50 transition-colors duration-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CakeIcon className="w-3.5 h-3.5 text-healthcare-600" />
                              <span className="text-xs font-semibold text-healthcare-700 uppercase tracking-wide">Age</span>
                            </div>
                            <div className="text-lg font-bold text-warm-gray-800">{patient.age}</div>
                            <div className="text-xs text-warm-gray-500">years old</div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-vibrant-teal-50 to-vibrant-teal-100/50 rounded-lg p-2.5 group-hover:from-vibrant-teal-100 group-hover:to-vibrant-teal-200/50 transition-colors duration-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <UserIcon className="w-3.5 h-3.5 text-vibrant-teal-600" />
                              <span className="text-xs font-semibold text-vibrant-teal-700 uppercase tracking-wide">Gender</span>
                            </div>
                            <div className="text-lg font-bold text-warm-gray-800 capitalize">{patient.gender}</div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-to-r from-warm-gray-50 to-warm-gray-100/50 rounded-lg p-3 group-hover:from-warm-gray-100 group-hover:to-warm-gray-200/50 transition-colors duration-300">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                              <EnvelopeIcon className="w-3.5 h-3.5 text-warm-gray-500" />
                              <span className="text-sm text-warm-gray-700 truncate flex-1">{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <PhoneIcon className="w-3.5 h-3.5 text-warm-gray-500" />
                              <span className="text-sm text-warm-gray-700 font-mono">{patient.phone}</span>
                            </div>
                            {patient.address && (
                              <div className="flex items-start gap-2.5">
                                <MapPinIcon className="w-3.5 h-3.5 text-warm-gray-500 mt-0.5" />
                                <span className="text-sm text-warm-gray-700 leading-relaxed">{patient.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          title="View patient profile and detailed information"
                          className="flex-1 bg-healthcare-600 text-white py-2.5 px-3 rounded-lg font-medium hover:bg-healthcare-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 text-sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button 
                          title="Schedule appointment for this patient"
                          className="bg-vibrant-teal-600 text-white py-2.5 px-3 rounded-lg hover:bg-vibrant-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <CalendarDaysIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
                          title="Delete patient record permanently"
                          className="bg-red-600 text-white py-2.5 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-healthcare-50 to-vibrant-teal-50 border-b border-warm-gray-100">
                  <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-warm-gray-600 uppercase tracking-wider">
                    <div className="col-span-4">Patient</div>
                    <div className="col-span-3">Contact</div>
                    <div className="col-span-2">Details</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>
                <div className="divide-y divide-warm-gray-100">
                  {filteredPatients.map((patient, index) => (
                    <div key={patient.id} className="group px-4 py-3 hover:bg-gradient-to-r hover:from-healthcare-50/30 hover:to-vibrant-teal-50/30 transition-all duration-200">
                      <div className="grid grid-cols-12 gap-3 items-center">
                        {/* Patient Info */}
                        <div className="col-span-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${getAvatarColor(index)} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                              <span className="text-white text-xs font-bold">{getPatientInitials(patient.name)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm text-warm-gray-900 group-hover:text-healthcare-700 transition-colors truncate">{patient.name}</h3>
                              <p className="text-xs text-warm-gray-500 font-mono">#{patient.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact */}
                        <div className="col-span-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-warm-gray-700">
                              <EnvelopeIcon className="w-3 h-3 text-warm-gray-400 flex-shrink-0" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-warm-gray-700">
                              <PhoneIcon className="w-3 h-3 text-warm-gray-400 flex-shrink-0" />
                              <span className="font-mono">{patient.phone}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Details */}
                        <div className="col-span-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <CakeIcon className="w-3 h-3 text-healthcare-600 flex-shrink-0" />
                              <span className="text-warm-gray-700">{patient.age}y</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                              <UserIcon className="w-3 h-3 text-vibrant-teal-600 flex-shrink-0" />
                              <span className="text-warm-gray-700 capitalize">{patient.gender}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-1">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            patient.status === 'active' 
                              ? 'bg-success-green-500 text-white' 
                              : 'bg-warm-gray-400 text-white'
                          }`}>
                            {patient.status === 'active' ? '●' : '○'}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <button 
                              title="View patient profile and detailed information"
                              className="px-2 py-1 bg-healthcare-600 text-white rounded text-xs hover:bg-healthcare-700 transition-colors duration-200 inline-flex items-center gap-1"
                            >
                              <EyeIcon className="w-3 h-3" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button 
                              title="Schedule appointment for this patient"
                              className="p-1 bg-vibrant-teal-600 text-white rounded hover:bg-vibrant-teal-700 transition-colors duration-200"
                            >
                              <CalendarDaysIcon className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeletePatient(patient.id)}
                              title="Delete patient record permanently"
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="modern-card text-center py-16">
              <div className="mb-6 flex justify-center">
                <UsersIcon className="w-16 h-16 text-warm-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-warm-gray-700 mb-4">
                {searchTerm ? 'No patients found' : 'No patients yet'}
              </h3>
              <p className="text-warm-gray-500 mb-8">
                {searchTerm 
                  ? "Try adjusting your search criteria" 
                  : "Add your first patient to get started"}
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700 inline-flex items-center gap-3"
              >
                <PlusIcon className="w-5 h-5" />
                Add First Patient
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-healthcare-600 p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <UserIcon className="w-8 h-8" />
                  Add New Patient
                </h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-white hover:text-healthcare-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleAddPatient} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-2">Full Name</label>
                    <input 
                      type="text"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Smith"
                      required
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-2">Email</label>
                    <input 
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-2">Phone</label>
                    <input 
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-2">Age</label>
                    <input 
                      type="number"
                      min="0"
                      max="150"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      required
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                      placeholder="Enter age"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-2">Gender</label>
                    <select 
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                      required
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-warm-gray-700 font-semibold mb-2">Address</label>
                  <textarea 
                    value={newPatient.address}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, City, State 12345"
                    rows={3}
                    className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 btn-modern bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createPatientMutation.isPending}
                    className="flex-1 btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700 disabled:opacity-50"
                  >
                    {createPatientMutation.isPending ? 'Adding...' : 'Add Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients

