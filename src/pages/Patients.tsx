import { useState } from 'react'
import { usePatients, useCreatePatient, useDeletePatient, usePatientStats } from '../hooks/usePatients'
import { NewPatient } from '../services/patientService'

function Patients() {
  // Fetch patients data using React Query
  const { data: patients = [], isLoading, error, refetch } = usePatients()
  const { data: stats = { total: 0, active: 0, inactive: 0 }, isLoading: statsLoading } = usePatientStats()
  
  // Mutations
  const createPatientMutation = useCreatePatient()
  const deletePatientMutation = useDeletePatient()

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newPatient, setNewPatient] = useState<Omit<NewPatient, 'id' | 'created_at' | 'updated_at' | 'status'>>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
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
        date_of_birth: '',
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

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-clinical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-gray-600 text-lg">Loading patients...</div>
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
          <div className="text-red-600 text-lg mb-4">Failed to load patients</div>
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
            <h1 className="text-4xl font-bold text-gray-800">Patients</h1>
            <p className="text-gray-600">Manage your clinic's patient records</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-medical-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <span className="text-xl">👤</span>
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-medical-100 px-4 py-2 rounded-xl">
              <span className="text-medical-700 font-medium">Total: {stats.total}</span>
            </div>
            <div className="bg-medical-100 px-4 py-2 rounded-xl">
              <span className="text-medical-700 font-medium">Active: {stats.active}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-medical-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">👤</span>
              Add New Patient
            </h2>
          </div>
          <form onSubmit={handleAddPatient} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="+1 234-567-8900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={newPatient.date_of_birth}
                  onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter complete address"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                disabled={createPatientMutation.isPending}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={createPatientMutation.isPending}
                className="px-6 py-3 bg-medical-500 text-white rounded-xl hover:bg-medical-600 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPatientMutation.isPending ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patients List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-medical-500 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-3">👥</span>
              All Patients
            </div>
            <span className="text-medical-100 text-sm">
              Showing {filteredPatients.length} of {patients.length} patients
            </span>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age/Gender</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Visit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient, index) => (
                <tr key={patient.id} className={`hover:bg-medical-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-medical-400 rounded-full flex items-center justify-center text-white font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{patient.name}</div>
                        <div className="text-sm text-gray-600">{patient.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-800 mb-1">{patient.email}</div>
                      <div className="text-gray-600">{patient.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-800">{calculateAge(patient.date_of_birth)} years</div>
                      <div className="text-gray-600">{patient.gender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      patient.status === 'Active' 
                        ? 'bg-medical-100 text-medical-800' 
                        : 'bg-clinical-200 text-clinical-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-medical-600 hover:text-medical-700 text-sm font-medium py-1 px-2 rounded hover:bg-medical-50 transition-colors duration-200">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-coral-600 hover:text-coral-700 text-sm font-medium py-1 px-2 rounded hover:bg-coral-50 transition-colors duration-200"
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
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-gray-500 text-lg font-medium">No patients found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Patients