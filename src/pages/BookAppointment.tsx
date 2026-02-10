import { useState, useEffect } from 'react'
import { usePatients, useCreatePatient } from '../hooks/usePatients'
import { useDoctors } from '../hooks/useDoctors'
import { useCreateAppointment, useAvailableTimeSlots } from '../hooks/useAppointments'
import { NewAppointment } from '../services/appointmentService'
import { NewPatient } from '../services/patientService'

function BookAppointment() {
  // Fetch data using React Query hooks
  const { data: patients = [], isLoading: patientsLoading } = usePatients()
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors()
  const createPatientMutation = useCreatePatient()
  const createAppointmentMutation = useCreateAppointment()

  const [formData, setFormData] = useState<Omit<NewAppointment, 'id' | 'created_at' | 'updated_at' | 'status'>>({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    reason: '',
    type: 'Consultation',
    priority: 'Medium'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showNewPatientForm, setShowNewPatientForm] = useState(false)
  const [newPatient, setNewPatient] = useState<Omit<NewPatient, 'id' | 'created_at' | 'updated_at' | 'status'>>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: ''
  })

  const appointmentTypes = ['Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup']
  const priorityLevels = ['Low', 'Medium', 'High']

  // Get available time slots
  const { data: availableSlots = [], refetch: refetchSlots } = useAvailableTimeSlots(
    formData.doctor_id, 
    formData.date
  )

  // Refetch slots when doctor or date changes
  useEffect(() => {
    if (formData.doctor_id && formData.date) {
      refetchSlots()
    }
  }, [formData.doctor_id, formData.date, refetchSlots])

  // Loading states
  if (patientsLoading || doctorsLoading) {
    return (
      <div className="p-8 min-h-screen bg-clinical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-gray-600 text-lg">Loading appointment form...</div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      setSubmitMessage('')
      
      await createAppointmentMutation.mutateAsync(formData)
      
      setSubmitMessage('✅ Appointment booked successfully!')
      
      // Reset form
      setFormData({
        patient_id: '',
        doctor_id: '',
        date: '',
        time: '',
        reason: '',
        type: 'Consultation',
        priority: 'Medium'
      })
      
    } catch (error) {
      console.error('Failed to book appointment:', error)
      setSubmitMessage('❌ Error booking appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createPatientMutation.mutateAsync(newPatient)
      
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: ''
      })
      setShowNewPatientForm(false)
      setSubmitMessage('✅ New patient added successfully!')
    } catch (error) {
      console.error('Failed to add patient:', error)
      setSubmitMessage('❌ Error adding patient. Please try again.')
    }
  }

  const selectedDoctor = doctors.find(doc => doc.id === formData.doctor_id)
  const selectedPatient = patients.find(patient => patient.id === formData.patient_id)

  return (
    <div className="p-8 space-y-8 min-h-screen bg-clinical-50">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <span className="w-2 h-12 bg-medical-500 rounded-full"></span>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Book New Appointment</h1>
          <p className="text-gray-600">Schedule a visit with one of our specialists</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">👤</span>
                Select Patient
              </h2>
              <button 
                onClick={() => setShowNewPatientForm(!showNewPatientForm)}
                className="text-medical-600 hover:text-medical-700 font-medium text-sm flex items-center space-x-1"
              >
                <span>+</span>
                <span>Add New Patient</span>
              </button>
            </div>
            
            {showNewPatientForm && (
              <form onSubmit={handleNewPatientSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={newPatient.date_of_birth}
                    onChange={(e) => setNewPatient({...newPatient, date_of_birth: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="px-4 py-2 bg-medical-500 text-white rounded-lg hover:bg-medical-600 text-sm">
                    Add Patient
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowNewPatientForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <select
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
              required
            >
              <option value="">Choose a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">👨‍⚕️</span>
              Select Doctor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.doctor_id === doctor.id 
                      ? 'border-medical-500 bg-medical-50' 
                      : 'border-gray-200 hover:border-medical-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, doctor_id: doctor.id }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👨‍⚕️</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📅</span>
              Appointment Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                  disabled={!formData.date || !formData.doctor_id}
                >
                  <option value="">Select time</option>
                  {formData.date && formData.doctor_id ? (
                    availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot.time} value={slot.time} disabled={!slot.available}>
                          {slot.time} {!slot.available ? '(Taken)' : ''}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No available slots</option>
                    )
                  ) : (
                    <option value="" disabled>Select date and doctor first</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  {priorityLevels.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200 h-32 resize-none"
                placeholder="Please describe the reason for your visit..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.patient_id || !formData.doctor_id || !formData.date || !formData.time}
              className="w-full bg-medical-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Booking...</span>
                </div>
              ) : (
                'Book Appointment'
              )}
            </button>

            {submitMessage && (
              <div className={`p-4 rounded-xl text-center font-medium ${
                submitMessage.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Summary
            </h3>
            
            {selectedPatient && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">Patient</h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedPatient.name}</p>
                  <p>{selectedPatient.email}</p>
                </div>
              </div>
            )}
            
            {selectedDoctor && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">Doctor</h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedDoctor.name}</p>
                  <p>{selectedDoctor.specialization}</p>
                </div>
              </div>
            )}
            
            {formData.date && formData.time && (
              <div className="text-sm text-gray-600">
                <p><span className="font-semibold">Date:</span> {new Date(formData.date).toLocaleDateString()}</p>
                <p><span className="font-semibold">Time:</span> {formData.time}</p>
                <p><span className="font-semibold">Type:</span> {formData.type}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment