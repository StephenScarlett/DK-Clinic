import { supabase, isDevelopmentMode } from '../lib/supabase'
import type { Database } from '../lib/supabase'

export type Doctor = Database['public']['Tables']['doctors']['Row']
export type NewDoctor = Database['public']['Tables']['doctors']['Insert']
export type DoctorUpdate = Database['public']['Tables']['doctors']['Update']

// Mock data for development mode
const defaultMockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@dkclinic.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Cardiology',
    experience: 15,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    rating: 4.9,
    image_url: null,
    status: 'Available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@dkclinic.com',
    phone: '+1 (555) 123-4568',
    specialization: 'Pediatrics',
    experience: 12,
    availability: ['Monday', 'Wednesday', 'Friday'],
    rating: 4.8,
    image_url: null,
    status: 'Busy',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@dkclinic.com',
    phone: '+1 (555) 123-4569',
    specialization: 'Dermatology',
    experience: 10,
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    rating: 4.9,
    image_url: null,
    status: 'Available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Get doctors from localStorage or use defaults
const getMockDoctors = (): Doctor[] => {
  if (typeof window === 'undefined') return defaultMockDoctors
  const stored = localStorage.getItem('dk-clinic-doctors')
  return stored ? JSON.parse(stored) : defaultMockDoctors
}

// Save doctors to localStorage
const saveMockDoctors = (doctors: Doctor[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dk-clinic-doctors', JSON.stringify(doctors))
  }
}

export const doctorService = {
  /**
   * Get all doctors from the database
   */
  async getAll(): Promise<Doctor[]> {
    try {
      if (isDevelopmentMode) {
        // Return mock data in development mode
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        return getMockDoctors()
      }
      
      if (!supabase) throw new Error('Supabase not configured')
      
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching doctors:', error)
        throw new Error(`Failed to fetch doctors: ${error.message}`)
      }
      
      return data || []
    } catch (error) {
      console.error('Error fetching doctors:', error)
      // Fallback to mock data on error
      return getMockDoctors()
    }
  },

  /**
   * Get a doctor by ID
   */
  async getById(id: string): Promise<Doctor | null> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Get by ID in development mode', { id })
      const doctors = getMockDoctors()
      const doctor = doctors.find(d => d.id === id)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return doctor || null
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching doctor:', error)
      throw new Error(`Failed to fetch doctor: ${error.message}`)
    }
    
    return data
  },

  /**
   * Create a new doctor
   */
  async create(doctor: Omit<NewDoctor, 'id' | 'created_at' | 'updated_at'>): Promise<Doctor> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Create in development mode', { doctor })
      const doctors = getMockDoctors()
      const newDoctor: Doctor = {
        ...doctor,
        id: Date.now().toString(),
        status: doctor.status || 'Available',
        rating: doctor.rating || 4.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      doctors.push(newDoctor)
      saveMockDoctors(doctors)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return newDoctor
    }

    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        ...doctor,
        status: doctor.status || 'Available',
        rating: doctor.rating || 4.5
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating doctor:', error)
      throw new Error(`Failed to create doctor: ${error.message}`)
    }
    
    return data
  },

  /**
   * Update an existing doctor
   */
  async update(id: string, updates: Omit<DoctorUpdate, 'id' | 'updated_at'>): Promise<Doctor> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Update in development mode', { id, updates })
      const doctors = getMockDoctors()
      const doctorIndex = doctors.findIndex(d => d.id === id)
      
      if (doctorIndex === -1) {
        throw new Error('Doctor not found')
      }
      
      const updatedDoctor = {
        ...doctors[doctorIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      doctors[doctorIndex] = updatedDoctor
      saveMockDoctors(doctors)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return updatedDoctor
    }

    const { data, error } = await supabase
      .from('doctors')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating doctor:', error)
      throw new Error(`Failed to update doctor: ${error.message}`)
    }
    
    return data
  },

  /**
   * Delete a doctor
   */
  async delete(id: string): Promise<void> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Delete in development mode', { id })
      const doctors = getMockDoctors()
      const doctorIndex = doctors.findIndex(d => d.id === id)
      
      if (doctorIndex === -1) {
        throw new Error('Doctor not found')
      }
      
      doctors.splice(doctorIndex, 1)
      saveMockDoctors(doctors)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return
    }

    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting doctor:', error)
      throw new Error(`Failed to delete doctor: ${error.message}`)
    }
  },

  /**
   * Search doctors by name or specialization
   */
  async search(query: string): Promise<Doctor[]> {
    if (!query.trim()) {
      return this.getAll()
    }

    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Search in development mode', { query })
      const searchTerm = query.toLowerCase()
      const results = getMockDoctors().filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchTerm) ||
        doctor.email.toLowerCase().includes(searchTerm)
      ).sort((a, b) => a.name.localeCompare(b.name))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return results
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .or(`name.ilike.%${query}%,specialization.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name')
    
    if (error) {
      console.error('Error searching doctors:', error)
      throw new Error(`Failed to search doctors: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get doctors by specialization
   */
  async getBySpecialization(specialization: string): Promise<Doctor[]> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Get by specialization in development mode', { specialization })
      const results = getMockDoctors()
        .filter(doctor => doctor.specialization === specialization)
        .sort((a, b) => a.name.localeCompare(b.name))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return results
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('specialization', specialization)
      .order('name')
    
    if (error) {
      console.error('Error fetching doctors by specialization:', error)
      throw new Error(`Failed to fetch doctors by specialization: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get doctors by status
   */
  async getByStatus(status: 'Available' | 'Busy' | 'Off Duty'): Promise<Doctor[]> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Get by status in development mode', { status })
      const results = getMockDoctors()
        .filter(doctor => doctor.status === status)
        .sort((a, b) => a.name.localeCompare(b.name))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return results
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('status', status)
      .order('name')
    
    if (error) {
      console.error('Error fetching doctors by status:', error)
      throw new Error(`Failed to fetch doctors by status: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get available doctors for a specific day
   */
  async getAvailableForDay(day: string): Promise<Doctor[]> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Get available for day in development mode', { day })
      const results = getMockDoctors()
        .filter(doctor => doctor.availability.includes(day) && doctor.status === 'Available')
        .sort((a, b) => a.name.localeCompare(b.name))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return results
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .contains('availability', [day])
      .eq('status', 'Available')
      .order('name')
    
    if (error) {
      console.error('Error fetching available doctors:', error)
      throw new Error(`Failed to fetch available doctors: ${error.message}`)
    }
    
    return data || []
  },

  /**
   * Get doctor statistics
   */
  async getStats(): Promise<{
    total: number
    available: number
    busy: number
    offDuty: number
    specializations: Record<string, number>
  }> {
    // Development mode: Use mock data
    if (isDevelopmentMode) {
      console.log('Doctor Service: Get stats in development mode')
      const stats = getMockDoctors().reduce(
        (acc, doctor) => {
          acc.total++
          
          switch (doctor.status) {
            case 'Available':
              acc.available++
              break
            case 'Busy':
              acc.busy++
              break
            case 'Off Duty':
              acc.offDuty++
              break
          }
          
          // Count specializations
          acc.specializations[doctor.specialization] = 
            (acc.specializations[doctor.specialization] || 0) + 1
          
          return acc
        },
        { 
          total: 0, 
          available: 0, 
          busy: 0, 
          offDuty: 0, 
          specializations: {} as Record<string, number>
        }
      )
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return stats
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('status, specialization')
    
    if (error) {
      console.error('Error fetching doctor stats:', error)
      throw new Error(`Failed to fetch doctor statistics: ${error.message}`)
    }
    
    const stats = data.reduce(
      (acc, doctor) => {
        acc.total++
        
        switch (doctor.status) {
          case 'Available':
            acc.available++
            break
          case 'Busy':
            acc.busy++
            break
          case 'Off Duty':
            acc.offDuty++
            break
        }
        
        // Count specializations
        acc.specializations[doctor.specialization] = 
          (acc.specializations[doctor.specialization] || 0) + 1
        
        return acc
      },
      { 
        total: 0, 
        available: 0, 
        busy: 0, 
        offDuty: 0, 
        specializations: {} as Record<string, number>
      }
    )
    
    return stats
  }
}