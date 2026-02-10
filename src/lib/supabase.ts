import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url')

// Development mode flag
export const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development' || !isSupabaseConfigured

// Create Supabase client only if configured, otherwise use null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// If not configured, log helpful message
if (!isSupabaseConfigured) {
  console.log('📝 Supabase not configured - running in development mode with mock data')
  console.log('💡 To use real Supabase: Update your .env file with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

// Database types will be generated later
export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          date_of_birth: string
          gender: string
          address: string
          status: 'Active' | 'Inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          date_of_birth: string
          gender: string
          address: string
          status?: 'Active' | 'Inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          date_of_birth?: string
          gender?: string
          address?: string
          status?: 'Active' | 'Inactive'
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          specialization: string
          experience: number
          availability: string[]
          rating: number
          image_url: string | null
          status: 'Available' | 'Busy' | 'Off Duty'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          specialization: string
          experience: number
          availability: string[]
          rating?: number
          image_url?: string | null
          status?: 'Available' | 'Busy' | 'Off Duty'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          specialization?: string
          experience?: number
          availability?: string[]
          rating?: number
          image_url?: string | null
          status?: 'Available' | 'Busy' | 'Off Duty'
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
          reason: string
          type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Checkup'
          priority: 'Low' | 'Medium' | 'High'
          duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
          reason: string
          type?: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Checkup'
          priority?: 'Low' | 'Medium' | 'High'
          duration?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
          reason?: string
          type?: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Checkup'
          priority?: 'Low' | 'Medium' | 'High'
          duration?: number
          updated_at?: string
        }
      }
    }
  }
}