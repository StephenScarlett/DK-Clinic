import { supabase, isDevelopmentMode } from '../lib/supabase'
import type { Database } from '../lib/supabase'

export type Patient = Database['public']['Tables']['patients']['Row']
export type NewPatient = Database['public']['Tables']['patients']['Insert']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']

// Mock data for development mode
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    date_of_birth: '1990-01-15',
    gender: 'Male',
    address: '123 Main St, Anytown, USA',
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 123-4568',
    date_of_birth: '1985-05-20',
    gender: 'Female',
    address: '456 Oak Ave, Another City, USA',
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1 (555) 123-4569',
    date_of_birth: '1978-11-30',
    gender: 'Male',
    address: '789 Pine St, Some Town, USA',
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const patientService = {
  /**
   * Get all patients from the database
   */
  async getAll(): Promise<Patient[]> {
    try {
      if (isDevelopmentMode) {
        // Return mock data in development mode
        await new Promise(resolve => setTimeout(resolve, 400)) // Simulate API delay
        return [...mockPatients]
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching patients:', error)
        throw new Error(`Failed to fetch patients: ${error.message}`)
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching patients:', error)
      // Fallback to mock data on error
      return [...mockPatients]
    }
  },

  /**
   * Get a patient by ID
   */
  async getById(id: string): Promise<Patient | null> {
    try {
      if (isDevelopmentMode) {
        // Return mock data in development mode
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockPatients.find(p => p.id === id) || null
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error fetching patient:', error)
        throw new Error(`Failed to fetch patient: ${error.message}`)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching patient:', error)
      // Fallback to mock data
      return mockPatients.find(p => p.id === id) || null
    }
  },

  /**
   * Create a new patient
   */
  async create(patient: Omit<NewPatient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    try {
      if (isDevelopmentMode) {
        // Simulate creating patient in development mode
        await new Promise(resolve => setTimeout(resolve, 600))
        const newPatient: Patient = {
          id: Date.now().toString(),
          ...patient,
          status: patient.status || 'Active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockPatients.push(newPatient)
        return newPatient
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          ...patient,
          status: patient.status || 'Active'
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating patient:', error)
        throw new Error(`Failed to create patient: ${error.message}`)
      }
      
      return data
    } catch (error) {
      console.error('Error creating patient:', error)
      throw error
    }
  },

  /**
   * Update an existing patient
   */
  async update(id: string, updates: Omit<PatientUpdate, 'id' | 'updated_at'>): Promise<Patient> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Patient Service: Update in development mode', { id, updates })
      const patientIndex = mockPatients.findIndex(p => p.id === id)
      
      if (patientIndex === -1) {
        throw new Error('Patient not found')
      }
      
      const updatedPatient = {
        ...mockPatients[patientIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      mockPatients[patientIndex] = updatedPatient
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return updatedPatient
    }

    const { data, error } = await supabase
      .from('patients')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating patient:', error)
      throw new Error(`Failed to update patient: ${error.message}`)
    }
    
    return data
  },

  /**
   * Delete a patient
   */
  async delete(id: string): Promise<void> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Patient Service: Delete in development mode', { id })
      const patientIndex = mockPatients.findIndex(p => p.id === id)
      
      if (patientIndex === -1) {
        throw new Error('Patient not found')
      }
      
      mockPatients.splice(patientIndex, 1)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return
    }

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting patient:', error)
      throw new Error(`Failed to delete patient: ${error.message}`)
    }
  },

  /**
   * Search patients by name, email, or phone
   */
  async search(query: string): Promise<Patient[]> {
    if (!query.trim()) {
      return this.getAll()
    }

    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Patient Service: Search in development mode', { query })
      const searchTerm = query.toLowerCase()
      const results = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm) ||
        patient.phone.includes(searchTerm)
      ).sort((a, b) => a.name.localeCompare(b.name))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return results
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name')
    
    if (error) {
      console.error('Error searching patients:', error)
      throw new Error(`Failed to search patients: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get patients by status
   */
  async getByStatus(status: 'Active' | 'Inactive'): Promise<Patient[]> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Patient Service: Get by status in development mode', { status })
      const results = mockPatients
        .filter(patient => patient.status === status)
        .sort((a, b) => a.name.localeCompare(b.name))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return results
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', status)
      .order('name')
    
    if (error) {
      console.error('Error fetching patients by status:', error)
      throw new Error(`Failed to fetch patients by status: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get patient statistics
   */
  async getStats(): Promise<{
    total: number
    active: number
    inactive: number
  }> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Patient Service: Get stats in development mode')
      const stats = mockPatients.reduce(
        (acc, patient) => {
          acc.total++
          if (patient.status === 'Active') {
            acc.active++
          } else {
            acc.inactive++
          }
          return acc
        },
        { total: 0, active: 0, inactive: 0 }
      )
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return stats
    }

    const { data, error } = await supabase
      .from('patients')
      .select('status')
    
    if (error) {
      console.error('Error fetching patient stats:', error)
      throw new Error(`Failed to fetch patient statistics: ${error.message}`)
    }
    
    const stats = data.reduce(
      (acc, patient) => {
        acc.total++
        if (patient.status === 'Active') {
          acc.active++
        } else {
          acc.inactive++
        }
        return acc
      },
      { total: 0, active: 0, inactive: 0 }
    )
    
    return stats
  }
}