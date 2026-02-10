import { useState } from 'react'

interface Patient {
  id: number
  name: string
  email: string
  phone: string
}

interface Doctor {
  id: number
  name: string
  specialization: string
  availability: string[]
  image?: string
  rating?: number
}

interface TimeSlot {
  time: string
  available: boolean
}

function BookAppointment() {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    type: 'Consultation',
    priority: 'Medium'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showNewPatientForm, setShowNewPatientForm] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Sample data - in a real app, this would come from your state management or API
  const patients: Patient[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', phone: '+1 234-567-8901' },
    { id: 2, name: 'Jane Wilson', email: 'jane.wilson@email.com', phone: '+1 234-567-8902' },
    { id: 3, name: 'Mike Brown', email: 'mike.brown@email.com', phone: '+1 234-567-8903' },
    { id: 4, name: 'Sarah Miller', email: 'sarah.miller@email.com', phone: '+1 234-567-8904' },
    { id: 5, name: 'Tom Anderson', email: 'tom.anderson@email.com', phone: '+1 234-567-8905' }
  ]

  const doctors: Doctor[] = [
    { 
      id: 1, 
      name: 'Dr. John Smith', 
      specialization: 'Cardiology', 
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    { 
      id: 2, 
      name: 'Dr. Sarah Johnson', 
      specialization: 'Dermatology', 
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    { 
      id: 3, 
      name: 'Dr. Michael Davis', 
      specialization: 'Pediatrics', 
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      rating: 4.7
    },
    { 
      id: 4, 
      name: 'Dr. Emily Wilson', 
      specialization: 'Orthopedics', 
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      rating: 4.6
    }
  ]

  const appointmentTypes = ['Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup']
  const priorityLevels = ['Low', 'Medium', 'High']

  const generateTimeSlots = (_selectedDate: string, _doctorId: string): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const baseSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30'
    ]
    
    // Simulate some taken slots
    const takenSlots = ['09:30', '11:00', '14:00', '15:30']
    
    baseSlots.forEach(time => {
      slots.push({
        time,
        available: !takenSlots.includes(time)
      })
    })

    return slots
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would make an API call here
      console.log('Booking appointment:', formData)
      
      setSubmitMessage('✅ Appointment booked successfully! Confirmation details have been sent via email.')
      setFormData({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        type: 'Consultation',
        priority: 'Medium'
      })
    } catch (error) {
      setSubmitMessage('❌ Error booking appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add this patient to your database
    console.log('Adding new patient:', newPatient)
    setNewPatient({ name: '', email: '', phone: '' })
    setShowNewPatientForm(false)
    setSubmitMessage('✅ New patient added successfully!')
  }

  const selectedDoctor = doctors.find(doc => doc.id === parseInt(formData.doctorId))
  const selectedPatient = patients.find(patient => patient.id === parseInt(formData.patientId))
  const availableTimeSlots = formData.date && formData.doctorId 
    ? generateTimeSlots(formData.date, formData.doctorId) 
    : []

  const getSpecializationIcon = (specialization: string) => {
    const icons: { [key: string]: string } = {
      'Cardiology': '❤️',
      'Dermatology': '🧴',
      'Pediatrics': '👶',
      'Orthopedics': '🦴',
      'Neurology': '🧠',
      'Gynecology': '🌸',
      'Surgery': '⚕️'
    }
    return icons[specialization] || '👨‍⚕️'
  }

  const getDayFromDate = (dateStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const date = new Date(dateStr)
    return days[date.getDay()]
  }

  const isDoctorAvailable = (dateStr: string, doctorId: string) => {
    if (!dateStr || !doctorId) return true
    const doctor = doctors.find(d => d.id === parseInt(doctorId))
    if (!doctor) return false
    const dayName = getDayFromDate(dateStr)
    return doctor.availability.includes(dayName)
  }

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
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
                    parseInt(formData.doctorId) === doctor.id 
                      ? 'border-medical-500 bg-medical-50' 
                      : 'border-gray-200 hover:border-medical-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, doctorId: doctor.id.toString() }))}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={doctor.image || 'https://via.placeholder.com/60x60/14b8a6/FFFFFF?text=Dr'} 
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/60x60/14b8a6/FFFFFF?text=Dr'
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{doctor.name}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <span>{getSpecializationIcon(doctor.specialization)}</span>
                        <span>{doctor.specialization}</span>
                      </div>
                      <div className="text-sm text-gray-500">⭐ {doctor.rating}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">📅</span>
              Appointment Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                  {formData.date && formData.doctorId && !isDoctorAvailable(formData.date, formData.doctorId) && (
                    <p className="text-red-600 text-sm mt-1">⚠️ Doctor not available on this day</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                    required
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
                  >
                    {priorityLevels.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              {formData.date && formData.doctorId && isDoctorAvailable(formData.date, formData.doctorId) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Available Time Slots *</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, time: slot.time }))}
                        disabled={!slot.available}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          formData.time === slot.time
                            ? 'bg-medical-500 text-white'
                            : slot.available
                            ? 'border border-gray-300 text-gray-700 hover:border-medical-500 hover:text-medical-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit *</label>
                <textarea
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please describe the reason for this appointment, symptoms, or any specific concerns..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200 resize-none"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !isDoctorAvailable(formData.date, formData.doctorId)}
                  className="flex-1 bg-medical-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Booking...
                    </span>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({
                    patientId: '',
                    doctorId: '',
                    date: '',
                    time: '',
                    reason: '',
                    type: 'Consultation',
                    priority: 'Medium'
                  })}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Appointment Summary */}
          {(selectedPatient || selectedDoctor || formData.date || formData.time) && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📋</span>
                Appointment Summary
              </h3>
              <div className="space-y-4">
                {selectedPatient && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-medical-400 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{selectedPatient.name}</div>
                      <div className="text-sm text-gray-600">{selectedPatient.email}</div>
                    </div>
                  </div>
                )}

                {selectedDoctor && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <img 
                      src={selectedDoctor.image || 'https://via.placeholder.com/40x40/14b8a6/FFFFFF?text=Dr'} 
                      alt={selectedDoctor.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/40x40/14b8a6/FFFFFF?text=Dr'
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{selectedDoctor.name}</div>
                      <div className="text-sm text-gray-600">{selectedDoctor.specialization}</div>
                    </div>
                  </div>
                )}

                {formData.date && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="font-semibold text-gray-800">📅 {new Date(formData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                  </div>
                )}

                {formData.time && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="font-semibold text-gray-800">🕐 {formData.time}</div>
                  </div>
                )}

                {formData.type && formData.type !== 'Consultation' && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="font-semibold text-gray-800">📋 {formData.type}</div>
                  </div>
                )}

                {formData.priority && formData.priority !== 'Medium' && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className={`font-semibold ${
                      formData.priority === 'High' ? 'text-red-600' :
                      formData.priority === 'Low' ? 'text-medical-600' :
                      'text-gray-800'
                    }`}>
                      ⚡ {formData.priority} Priority
                    </div>
                  </div>
                )}

                {formData.reason && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600 font-medium">Reason:</div>
                    <div className="text-gray-800">{formData.reason}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-medical-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">📝 Booking Tips</h3>
            <ul className="space-y-2 text-sm text-medical-100">
              <li>• Book at least 24 hours in advance</li>
              <li>• Arrive 15 minutes early for your appointment</li>
              <li>• Bring relevant medical documents</li>
              <li>• Check your insurance coverage beforehand</li>
              <li>• Cancel at least 2 hours before if needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {submitMessage && (
        <div className={`fixed bottom-8 right-8 p-6 rounded-xl shadow-2xl max-w-md transition-all duration-300 ${
          submitMessage.includes('Error') 
            ? 'bg-red-100 border border-red-200 text-red-800' 
            : 'bg-medical-100 border border-medical-200 text-medical-800'
        }`}>
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <div className="font-semibold mb-1">
                {submitMessage.includes('Error') ? 'Booking Failed' : 'Successfully Booked!'}
              </div>
              <div className="text-sm">{submitMessage}</div>
            </div>
            <button 
              onClick={() => setSubmitMessage('')}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookAppointment