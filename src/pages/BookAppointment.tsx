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

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Omit<NewAppointment, 'id' | 'created_at' | 'updated_at' | 'status'>>({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    reason: '',
    type: 'Consultation',
    priority: 'Medium'
  })

  const steps = [
    { id: 1, title: 'Select Patient', icon: '👤', completed: false },
    { id: 2, title: 'Choose Doctor', icon: '👨‍⚕️', completed: false },
    { id: 3, title: 'Pick Date & Time', icon: '📅', completed: false },
    { id: 4, title: 'Appointment Details', icon: '📌', completed: false },
    { id: 5, title: 'Confirmation', icon: '✅', completed: false }
  ]

  const appointmentTypes = [
    { value: 'Consultation', icon: '💬', description: 'General medical consultation' },
    { value: 'Follow-up', icon: '🔄', description: 'Follow-up appointment' },
    { value: 'Emergency', icon: '🚨', description: 'Urgent medical attention' },
    { value: 'Surgery', icon: '🔪', description: 'Surgical procedure' },
    { value: 'Checkup', icon: '🩺', description: 'Routine health checkup' }
  ]

  const priorityLevels = [
    { value: 'Low', color: 'success-green', description: 'Routine appointment' },
    { value: 'Medium', color: 'bright-orange', description: 'Moderate urgency' },
    { value: 'High', color: 'red', description: 'High priority' }
  ]

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
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50 flex items-center justify-center">
        <div className="text-center modern-card">
          <div className="text-6xl mb-4 animate-pulse">📅</div>
          <div className="text-warm-gray-600 text-lg">Preparing appointment booking...</div>
          <div className="mt-4 w-64 h-2 bg-warm-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-healthcare-500 to-vibrant-teal-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createAppointmentMutation.mutateAsync(formData)
      setCurrentStep(5) // Move to confirmation step
    } catch (error) {
      console.error('Failed to book appointment:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const selectedDoctor = doctors.find(doc => doc.id === formData.doctor_id)
  const selectedPatient = patients.find(patient => patient.id === formData.patient_id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 via-warm-gray-50 to-vibrant-teal-50">
      {/* Modern Header */}
      <div className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h1 className="text-6xl font-bold text-warm-gray-900 mb-6">
              Book Your <span className="text-healthcare-600">Appointment</span>
            </h1>
            <p className="text-xl text-warm-gray-600 max-w-2xl mx-auto leading-relaxed">
              Schedule your visit with our expert healthcare professionals in just a few simple steps.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="modern-card mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                    currentStep === step.id 
                      ? 'bg-healthcare-600 text-white' 
                      : currentStep > step.id 
                        ? 'bg-success-green-500 text-white' 
                        : 'bg-warm-gray-200 text-warm-gray-500'
                  }`}>
                    {currentStep > step.id ? 'âœ“' : step.icon}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`font-semibold ${
                      currentStep >= step.id ? 'text-warm-gray-900' : 'text-warm-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? 'bg-success-green-500' : 'bg-warm-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="modern-card">
            {/* Step 1: Patient Selection */}
            {currentStep === 1 && (
              <div className="fade-in">
                <h2 className="text-3xl font-bold text-warm-gray-900 mb-8 flex items-center gap-4">
                  👤 Select Patient
                </h2>
                
                <div className="grid gap-6">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setFormData(prev => ({ ...prev, patient_id: patient.id }))}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.patient_id === patient.id
                          ? 'border-healthcare-500 bg-healthcare-50'
                          : 'border-warm-gray-200 hover:border-healthcare-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-healthcare-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {patient.name[0]}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-warm-gray-900">{patient.name}</h3>
                            <p className="text-warm-gray-600">{patient.email}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          formData.patient_id === patient.id
                            ? 'bg-healthcare-500 border-healthcare-500'
                            : 'border-warm-gray-300'
                        }`}>
                          {formData.patient_id === patient.id && (
                            <div className="w-full h-full flex items-center justify-center text-white text-sm">âœ“</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button 
                    disabled
                    className="btn-modern bg-warm-gray-200 text-warm-gray-400 cursor-not-allowed"
                  >
                    â† Previous
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.patient_id}
                    className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next â†’
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Doctor Selection */}
            {currentStep === 2 && (
              <div className="fade-in">
                <h2 className="text-3xl font-bold text-warm-gray-900 mb-8 flex items-center gap-4">
                  👨‍⚕️ Choose Doctor
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {doctors.map((doctor, index) => (
                    <div
                      key={doctor.id}
                      onClick={() => setFormData(prev => ({ ...prev, doctor_id: doctor.id }))}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.doctor_id === doctor.id
                          ? 'border-healthcare-500 bg-healthcare-50'
                          : 'border-warm-gray-200 hover:border-healthcare-300 bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl ${
                          ['bg-healthcare-500', 'bg-vibrant-teal-500', 'bg-medical-purple-500', 'bg-bright-orange-500', 'bg-success-green-500'][index % 5]
                        } text-white`}>
                          👨‍⚕️
                        </div>
                        <h3 className="text-xl font-bold text-warm-gray-900 mb-2">{doctor.name}</h3>
                        <p className="text-warm-gray-600 mb-4">{doctor.specialization}</p>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="flex text-bright-orange-400">{'â˜…'.repeat(5)}</div>
                          <span className="text-warm-gray-600">{doctor.rating || '4.9'}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          doctor.status === 'Available' 
                            ? 'bg-success-green-100 text-success-green-800' 
                            : 'bg-warm-gray-100 text-warm-gray-800'
                        }`}>
                          {doctor.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button 
                    onClick={prevStep}
                    className="btn-modern bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300"
                  >
                    â† Previous
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.doctor_id}
                    className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next â†’
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {currentStep === 3 && (
              <div className="fade-in">
                <h2 className="text-3xl font-bold text-warm-gray-900 mb-8 flex items-center gap-4">
                  📅 Pick Date & Time
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-4">Select Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-4">Available Times</label>
                    {formData.date && availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                            className={`p-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                              formData.time === slot
                                ? 'border-healthcare-500 bg-healthcare-50 text-healthcare-700'
                                : 'border-warm-gray-200 hover:border-healthcare-300 bg-white text-warm-gray-700'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : formData.date ? (
                      <div className="text-warm-gray-500 text-center py-8">
                        No available slots for this date
                      </div>
                    ) : (
                      <div className="text-warm-gray-500 text-center py-8">
                        Please select a date first
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button 
                    onClick={prevStep}
                    className="btn-modern bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300"
                  >
                    â† Previous
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.date || !formData.time}
                    className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next â†’
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Appointment Details */}
            {currentStep === 4 && (
              <div className="fade-in">
                <h2 className="text-3xl font-bold text-warm-gray-900 mb-8 flex items-center gap-4">
                  📌 Appointment Details
                </h2>
                
                <div className="space-y-8">
                  {/* Appointment Type */}
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-4">Appointment Type</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {appointmentTypes.map((type) => (
                        <div
                          key={type.value}
                          onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            formData.type === type.value
                              ? 'border-healthcare-500 bg-healthcare-50'
                              : 'border-warm-gray-200 hover:border-healthcare-300 bg-white'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <h3 className="font-semibold text-warm-gray-900">{type.value}</h3>
                            <p className="text-sm text-warm-gray-600">{type.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-4">Priority Level</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {priorityLevels.map((priority) => (
                        <div
                          key={priority.value}
                          onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            formData.priority === priority.value
                              ? `border-${priority.color}-500 bg-${priority.color}-50`
                              : 'border-warm-gray-200 hover:border-warm-gray-300 bg-white'
                          }`}
                        >
                          <div className="text-center">
                            <h3 className="font-semibold text-warm-gray-900">{priority.value}</h3>
                            <p className="text-sm text-warm-gray-600">{priority.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-warm-gray-700 font-semibold mb-4">Reason for Visit</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Describe the reason for your visit..."
                      rows={4}
                      className="w-full p-4 border border-warm-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healthcare-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button 
                    onClick={prevStep}
                    className="btn-modern bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300"
                  >
                    â† Previous
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={createAppointmentMutation.isPending}
                    className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700 disabled:opacity-50"
                  >
                    {createAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="fade-in text-center">
                <div className="text-6xl mb-6">\ud83c\udf89</div>
                <h2 className="text-4xl font-bold text-warm-gray-900 mb-6">
                  Appointment Confirmed!
                </h2>
                <p className="text-xl text-warm-gray-600 mb-12">
                  Your appointment has been successfully scheduled.
                </p>

                {/* Appointment Summary */}
                <div className="modern-card max-w-md mx-auto text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-warm-gray-600">Patient:</span>
                      <span className="font-semibold">{selectedPatient?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray-600">Doctor:</span>
                      <span className="font-semibold">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray-600">Date:</span>
                      <span className="font-semibold">{new Date(formData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray-600">Time:</span>
                      <span className="font-semibold">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray-600">Type:</span>
                      <span className="font-semibold">{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray-600">Priority:</span>
                      <span className="font-semibold">{formData.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button 
                    onClick={() => window.location.href = '/appointments'}
                    className="btn-modern bg-healthcare-600 text-white hover:bg-healthcare-700"
                  >
                    View Appointments
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentStep(1)
                      setFormData({
                        patient_id: '',
                        doctor_id: '',
                        date: '',
                        time: '',
                        reason: '',
                        type: 'Consultation',
                        priority: 'Medium'
                      })
                    }}
                    className="btn-modern bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment

