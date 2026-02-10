import { useState } from 'react'
import { useAppointments, useUpdateAppointmentStatus, useDeleteAppointment, useAppointmentStats } from '../hooks/useAppointments'

function Appointments() {
  // Fetch appointments data using React Query
  const { data: appointments = [], isLoading, error, refetch } = useAppointments()
  const { data: stats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0, thisWeek: 0, byType: {}, byPriority: {} }, isLoading: statsLoading } = useAppointmentStats()
  
  // Mutations
  const updateStatusMutation = useUpdateAppointmentStatus()
  const deleteAppointmentMutation = useDeleteAppointment()



  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<string>('')
  const [filterDoctor, setFilterDoctor] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'today' | 'upcoming' | 'all'>('all')

  // Get unique doctors for filter
  const uniqueDoctors = [...new Set(appointments.map(apt => apt.doctorName))]

  // Filter appointments based on various criteria
  const filteredAppointments = appointments.filter(appointment => {
    const statusMatch = filterStatus === 'all' || appointment.status.toLowerCase() === filterStatus
    const dateMatch = !filterDate || appointment.date === filterDate
    const doctorMatch = !filterDoctor || appointment.doctorName === filterDoctor
    const searchMatch = !searchTerm || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())

    let viewModeMatch = true
    const today = new Date().toISOString().split('T')[0]
    const appointmentDate = appointment.date

    if (viewMode === 'today') {
      viewModeMatch = appointmentDate === today
    } else if (viewMode === 'upcoming') {
      viewModeMatch = appointmentDate >= today
    }

    return statusMatch && dateMatch && doctorMatch && searchMatch && viewModeMatch
  })

  // Sort appointments by date and time
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`)
    const dateTimeB = new Date(`${b.date}T${b.time}`)
    return dateTimeA.getTime() - dateTimeB.getTime()
  })

  const handleStatusChange = (id: number, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    ))
  }

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-medical-100 text-medical-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'completed':
        return 'bg-medical-200 text-medical-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-medical-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'Consultation': '👩‍⚕️',
      'Follow-up': '🔄',
      'Emergency': '🚨',
      'Surgery': '⚕️',
      'Checkup': '🩺'
    }
    return icons[type || 'Consultation'] || '📋'
  }

  const clearFilters = () => {
    setFilterStatus('all')
    setFilterDate('')
    setFilterDoctor('')
    setSearchTerm('')
    setViewMode('all')
  }



  return (
    <div className="p-8 space-y-8 min-h-screen bg-clinical-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="w-2 h-12 bg-medical-500 rounded-full"></span>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-600">Manage your clinic's appointments</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'today' 
                  ? 'bg-medical-500 text-white' 
                  : 'text-gray-600 hover:text-medical-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'upcoming' 
                  ? 'bg-medical-500 text-white' 
                  : 'text-gray-600 hover:text-medical-600'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'all' 
                  ? 'bg-medical-500 text-white' 
                  : 'text-gray-600 hover:text-medical-600'
              }`}
            >
              All
            </button>
          </div>
          <button className="bg-medical-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
            <span className="text-xl">📅</span>
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-medical-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.total}</div>
          <div className="text-medical-100 font-medium">Total Appointments</div>
        </div>
        <div className="bg-medical-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.today}</div>
          <div className="text-medical-100 font-medium">Today's Appointments</div>
        </div>
        <div className="bg-coral-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.pending}</div>
          <div className="text-coral-100 font-medium">Pending</div>
        </div>
        <div className="bg-medical-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.confirmed}</div>
          <div className="text-medical-100 font-medium">Confirmed</div>
        </div>
        <div className="bg-medical-300 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.completed}</div>
          <div className="text-medical-100 font-medium">Completed</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search patients, doctors, or reasons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
          >
            <option value="">All Doctors</option>
            {uniqueDoctors.map((doctor) => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-colors duration-200"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-medical-500 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-3">📅</span>
              Appointments
            </div>
            <span className="text-medical-100 text-sm">
              Showing {sortedAppointments.length} of {appointments.length} appointments
            </span>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient & Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type & Reason</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAppointments.map((appointment, index) => (
                <tr key={appointment.id} className={`hover:bg-medical-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-800">{appointment.patientName}</div>
                      <div className="text-sm text-gray-600">{appointment.doctorName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-800">
                        {new Date(appointment.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">{appointment.time} • {appointment.duration}min</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(appointment.type || '')}</span>
                        <span className="text-sm font-medium text-gray-700">{appointment.type}</span>
                      </div>
                      <div className="text-sm text-gray-600">{appointment.reason}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${getPriorityColor(appointment.priority || '')}`}>
                      {appointment.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {appointment.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Confirmed')}
                          className="text-medical-600 hover:text-medical-700 text-xs font-medium py-1 px-2 rounded hover:bg-medical-50 transition-colors duration-200"
                        >
                          Confirm
                        </button>
                      )}
                      {appointment.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Completed')}
                          className="text-medical-600 hover:text-medical-700 text-xs font-medium py-1 px-2 rounded hover:bg-medical-50 transition-colors duration-200"
                        >
                          Complete
                        </button>
                      )}
                      {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Cancelled')}
                          className="text-orange-600 hover:text-orange-700 text-xs font-medium py-1 px-2 rounded hover:bg-orange-50 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium py-1 px-2 rounded hover:bg-red-50 transition-colors duration-200"
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

        {sortedAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <div className="text-gray-500 text-lg font-medium">No appointments found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm || filterStatus !== 'all' || filterDoctor || filterDate 
                ? 'Try adjusting your search criteria' 
                : 'Schedule your first appointment to get started'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Appointments