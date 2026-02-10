import { supabase, isDevelopmentMode } from '../lib/supabase'
import type { Database } from '../lib/supabase'

export type Appointment = Database['public']['Tables']['appointments']['Row']
export type NewAppointment = Database['public']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

// Extended appointment type with related data
export interface AppointmentWithDetails extends Appointment {
  patient?: {
    id: string
    name: string
    email: string
    phone: string
  }
  doctor?: {
    id: string
    name: string
    specialization: string
    email: string
  }
}

// Mock data for development mode
const mockAppointments: AppointmentWithDetails[] = [
  {
    id: '1',
    patient_id: '1',
    doctor_id: '1',
    date: '2024-02-15',
    time: '09:00',
    reason: 'Regular checkup',
    type: 'Consultation',
    priority: 'Medium',
    status: 'Confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567'
    },
    doctor: {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      email: 'sarah.johnson@dkclinic.com'
    }
  },
  {
    id: '2',
    patient_id: '2',
    doctor_id: '2',
    date: '2024-02-15',
    time: '10:30',
    reason: 'Pediatric consultation',
    type: 'Consultation',
    priority: 'High',
    status: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 123-4568'
    },
    doctor: {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Pediatrics',
      email: 'michael.chen@dkclinic.com'
    }
  }
]

export const appointmentService = {
  /**
   * Get all appointments with patient and doctor details
   */
  async getAll(): Promise<AppointmentWithDetails[]> {
    try {
      if (isDevelopmentMode) {
        // Return mock data in development mode
        await new Promise(resolve => setTimeout(resolve, 600)) // Simulate API delay
        return [...mockAppointments]
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(id, name, email, phone),
          doctor:doctors(id, name, specialization, email)
        `)
        .order('date', { ascending: false })
        .order('time', { ascending: true })
      
      if (error) {
        console.error('Error fetching appointments:', error)
        throw new Error(`Failed to fetch appointments: ${error.message}`)
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching appointments:', error)
      // Fallback to mock data on error
      return [...mockAppointments]
    }
  },

  /**
   * Get an appointment by ID with details
   */
  async getById(id: string): Promise<AppointmentWithDetails | null> {
    try {
      if (isDevelopmentMode) {
        // Return mock data in development mode
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockAppointments.find(apt => apt.id === id) || null
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(id, name, email, phone),
          doctor:doctors(id, name, specialization, email)
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching appointment:', error)
        throw new Error(`Failed to fetch appointment: ${error.message}`)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching appointment:', error)
      // Fallback to mock data
      return mockAppointments.find(apt => apt.id === id) || null
    }
  },

  /**
   * Create a new appointment
   */
  async create(appointment: Omit<NewAppointment, 'id' | 'created_at' | 'updated_at'>): Promise<AppointmentWithDetails> {
    try {
      if (isDevelopmentMode) {
        // Simulate creating appointment in development mode
        await new Promise(resolve => setTimeout(resolve, 800))
        const newAppointment: AppointmentWithDetails = {
          id: Date.now().toString(),
          ...appointment,
          status: appointment.status || 'Pending',
          type: appointment.type || 'Consultation',
          priority: appointment.priority || 'Medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          patient: mockAppointments[0]?.patient, // Use first mock patient for demo
          doctor: mockAppointments[0]?.doctor    // Use first mock doctor for demo
        }
        mockAppointments.push(newAppointment)
        return newAppointment
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointment,
          status: appointment.status || 'Pending',
          type: appointment.type || 'Consultation',
          priority: appointment.priority || 'Medium'
        }])
        .select(`
          *,
          patient:patients(id, name, email, phone),
          doctor:doctors(id, name, specialization, email)
        `)
        .single()
      
      if (error) {
        console.error('Error creating appointment:', error)
        throw new Error(`Failed to create appointment: ${error.message}`)
      }
      
      return data
    } catch (error) {
      console.error('Error creating appointment:', error)
      throw error
    }
  },

  /**
   * Update an existing appointment
   */
  async update(id: string, updates: Omit<AppointmentUpdate, 'id' | 'updated_at'>): Promise<AppointmentWithDetails> {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .single()
    
    if (error) {
      console.error('Error updating appointment:', error)
      throw new Error(`Failed to update appointment: ${error.message}`)
    }
    
    return data
  },

  /**
   * Delete an appointment
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting appointment:', error)
      throw new Error(`Failed to delete appointment: ${error.message}`)
    }
  },

  /**
   * Update appointment status
   */
  async updateStatus(id: string, status: Appointment['status']): Promise<AppointmentWithDetails> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .single()
    
    if (error) {
      console.error('Error updating appointment status:', error)
      throw new Error(`Failed to update appointment status: ${error.message}`)
    }
    
    return data
  },

  /**
   * Get appointments by date
   */
  async getByDate(date: string): Promise<AppointmentWithDetails[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .eq('appointment_date', date)
      .order('appointment_time')
    
    if (error) {
      console.error('Error fetching appointments by date:', error)
      throw new Error(`Failed to fetch appointments by date: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get appointments by patient
   */
  async getByPatient(patientId: string): Promise<AppointmentWithDetails[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false })
    
    if (error) {
      console.error('Error fetching appointments by patient:', error)
      throw new Error(`Failed to fetch appointments by patient: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get appointments by doctor
   */
  async getByDoctor(doctorId: string): Promise<AppointmentWithDetails[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments by doctor:', error)
      throw new Error(`Failed to fetch appointments by doctor: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get appointments by status
   */
  async getByStatus(status: Appointment['status']): Promise<AppointmentWithDetails[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .eq('status', status)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments by status:', error)
      throw new Error(`Failed to fetch appointments by status: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get today's appointments
   */
  async getTodayAppointments(): Promise<AppointmentWithDetails[]> {
    const today = new Date().toISOString().split('T')[0]
    return this.getByDate(today)
  },

  /**
   * Get upcoming appointments (next 7 days)
   */
  async getUpcoming(): Promise<AppointmentWithDetails[]> {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(id, name, email, phone),
        doctor:doctors(id, name, specialization, email)
      `)
      .gte('appointment_date', today.toISOString().split('T')[0])
      .lte('appointment_date', nextWeek.toISOString().split('T')[0])
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
    
    if (error) {
      console.error('Error fetching upcoming appointments:', error)
      throw new Error(`Failed to fetch upcoming appointments: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Check for appointment conflicts
   */
  async checkConflict(
    doctorId: string, 
    date: string, 
    time: string, 
    duration: number = 30,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const startTime = new Date(`${date}T${time}`)
    const endTime = new Date(startTime.getTime() + duration * 60000)
    
    let query = supabase
      .from('appointments')
      .select('id, appointment_time, duration')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .neq('status', 'Cancelled')
    
    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error checking appointment conflict:', error)
      throw new Error(`Failed to check appointment conflict: ${error.message}`)
    }
    
    // Check for time conflicts
    for (const appointment of data || []) {
      const appointmentStart = new Date(`${date}T${appointment.appointment_time}`)
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000)
      
      if (
        (startTime >= appointmentStart && startTime < appointmentEnd) ||
        (endTime > appointmentStart && endTime <= appointmentEnd) ||
        (startTime <= appointmentStart && endTime >= appointmentEnd)
      ) {
        return true // Conflict found
      }
    }
    
    return false // No conflict
  },

  /**
   * Get appointment statistics
   */
  async getStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    today: number
    thisWeek: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  }> {
    const today = new Date().toISOString().split('T')[0]
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const [allAppointments, todayAppointments, thisWeekAppointments] = await Promise.all([
      supabase.from('appointments').select('status, type, priority'),
      supabase.from('appointments').select('id').eq('appointment_date', today),
      supabase.from('appointments')
        .select('id')
        .gte('appointment_date', weekStart.toISOString().split('T')[0])
        .lte('appointment_date', weekEnd.toISOString().split('T')[0])
    ])
    
    if (allAppointments.error) {
      throw new Error(`Failed to fetch appointment statistics: ${allAppointments.error.message}`)
    }
    
    const stats = allAppointments.data.reduce(
      (acc, appointment) => {
        acc.total++
        
        // Count by status
        switch (appointment.status) {
          case 'Pending':
            acc.pending++
            break
          case 'Confirmed':
            acc.confirmed++
            break
          case 'Completed':
            acc.completed++
            break
          case 'Cancelled':
            acc.cancelled++
            break
        }
        
        // Count by type
        acc.byType[appointment.type] = (acc.byType[appointment.type] || 0) + 1
        
        // Count by priority
        acc.byPriority[appointment.priority] = (acc.byPriority[appointment.priority] || 0) + 1
        
        return acc
      },
      {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        today: todayAppointments.data?.length || 0,
        thisWeek: thisWeekAppointments.data?.length || 0,
        byType: {} as Record<string, number>,
        byPriority: {} as Record<string, number>
      }
    )
    
    return stats
  },

  /**
   * Get available time slots for a specific doctor on a specific date
   */
  async getAvailableTimeSlots(doctorId: string, date: string): Promise<{ time: string; available: boolean }[]> {
    try {
      if (isDevelopmentMode) {
        // Return mock time slots in development mode
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const baseSlots = [
          '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
          '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
          '17:00', '17:30'
        ]
        
        // Simulate some taken slots for demonstration
        const takenSlots = ['09:30', '11:00', '14:00', '15:30']
        
        return baseSlots.map(time => ({
          time,
          available: !takenSlots.includes(time)
        }))
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      // Get all existing appointments for the doctor on the specified date
      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('doctor_id', doctorId)
        .eq('date', date)
        .neq('status', 'Cancelled')
      
      if (error) {
        console.error('Error fetching existing appointments:', error)
        throw error
      }
      
      // Generate time slots (8 AM to 6 PM, 30-minute intervals)
      const baseSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30'
      ]
      
      const bookedTimes = existingAppointments.map((apt: { time: string }) => apt.time)
      
      return baseSlots.map(time => ({
        time,
        available: !bookedTimes.includes(time)
      }))
      
    } catch (error) {
      console.error('Error getting available time slots:', error)
      // Fallback to basic available slots
      return [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
        { time: '16:00', available: true }
      ]
    }
  }
}