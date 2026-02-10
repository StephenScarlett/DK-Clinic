import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('🔍 Environment variables loaded:')
console.log('VITE_SUPABASE_URL:', supabaseUrl)
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined')
console.log('VITE_APP_MODE:', import.meta.env.VITE_APP_MODE)

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url' && supabaseKey !== 'your_supabase_anon_key')

// Development mode flag
export const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development' || !isSupabaseConfigured

// Create Supabase client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// If not configured, log helpful message
if (!isSupabaseConfigured) {
  console.log('📝 Supabase not configured - running in development mode with localStorage')
  console.log('💡 To use Supabase: Update your .env file with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
} else {
  console.log('✅ Supabase configured successfully')
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
          age: number
          gender: 'Male' | 'Female' | 'Other'
          address: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          age: number
          gender: 'Male' | 'Female' | 'Other'
          address: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          age?: number
          gender?: 'Male' | 'Female' | 'Other'
          address?: string
          status?: 'active' | 'inactive'
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
          status: 'Available' | 'Busy' | 'Off Duty'
          rating: number
          image_url: string | null
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
          status?: 'Available' | 'Busy' | 'Off Duty'
          rating?: number
          image_url?: string | null
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
          status?: 'Available' | 'Busy' | 'Off Duty'
          rating?: number
          image_url?: string | null
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
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          updated_at?: string
        }
      }
    }
  }
}