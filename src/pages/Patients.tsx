import { useState } from 'react'

interface Patient {
  id: number
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  lastVisit?: string
  status?: 'Active' | 'Inactive'
}

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 234-567-8901',
      dateOfBirth: '1985-05-15',
      gender: 'Male',
      address: '123 Main St, City, State 12345',
      lastVisit: '2024-01-10',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Wilson',
      email: 'jane.wilson@email.com',
      phone: '+1 234-567-8902',
      dateOfBirth: '1990-08-22',
      gender: 'Female',
      address: '456 Oak Ave, City, State 12345',
      lastVisit: '2024-01-08',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Brown',
      email: 'mike.brown@email.com',
      phone: '+1 234-567-8903',
      dateOfBirth: '1978-12-03',
      gender: 'Male',
      address: '789 Pine Rd, City, State 12345',
      lastVisit: '2023-12-15',
      status: 'Inactive'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  })

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    const patient: Patient = {
      ...newPatient,
      id: Math.max(...patients.map(p => p.id), 0) + 1,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    setPatients([...patients, patient])
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: ''
    })
    setShowAddForm(false)
  }

  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter(p => p.id !== id))
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
              <span className="text-medical-700 font-medium">Total: {patients.length}</span>
            </div>
            <div className="bg-medical-100 px-4 py-2 rounded-xl">
              <span className="text-medical-700 font-medium">Active: {patients.filter(p => p.status === 'Active').length}</span>
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
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
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
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-medical-500 text-white rounded-xl hover:bg-medical-600 transition-all duration-200 font-semibold shadow-lg"
              >
                Add Patient
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
                      <div className="font-medium text-gray-800">{calculateAge(patient.dateOfBirth)} years</div>
                      <div className="text-gray-600">{patient.gender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
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