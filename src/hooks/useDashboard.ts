import { useQuery } from '@tanstack/react-query'
import { supabase, isDevelopmentMode } from '../lib/supabase'
import { usePatientStats } from './usePatients'
import { useDoctorStats } from './useDoctors'
import { useAppointmentStats } from './useAppointments'

export interface DashboardOverview {
  patients: {
    total: number
    active: number
    inactive: number
    recentlyAdded: number
  }
  doctors: {
    total: number
    available: number
    busy: number
    offDuty: number
    specializations: Record<string, number>
  }
  appointments: {
    total: number
    today: number
    thisWeek: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  }
  recentActivity: {
    recentPatients: Array<{
      id: string
      name: string
      email: string
      created_at: string
    }>
    todayAppointments: Array<{
      id: string
      patient_name: string
      doctor_name: string
      time: string
      status: string
      type: string
    }>
  }
}

/**
 * Hook to get comprehensive dashboard statistics
 */
export const useDashboardOverview = () => {
  const { data: patientStats, isLoading: patientsLoading } = usePatientStats()
  const { data: doctorStats, isLoading: doctorsLoading } = useDoctorStats()
  const { data: appointmentStats, isLoading: appointmentsLoading } = useAppointmentStats()
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity()

  const isLoading = patientsLoading || doctorsLoading || appointmentsLoading || activityLoading

  // Calculate recently added patients (last 7 days)
  const { data: recentPatientsCount = 0 } = useRecentPatientsCount()

  const data: DashboardOverview | undefined = 
    patientStats && doctorStats && appointmentStats && recentActivity
      ? {
          patients: {
            ...patientStats,
            recentlyAdded: recentPatientsCount,
          },
          doctors: doctorStats,
          appointments: appointmentStats,
          recentActivity,
        }
      : undefined

  return {
    data,
    isLoading,
  }
}

/**
 * Hook to get recent activity data
 */
export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      // Get recent patients (last 5)
      const { data: recentPatients, error: patientsError } = await supabase
        .from('patients')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (patientsError) {
        throw new Error(`Failed to fetch recent patients: ${patientsError.message}`)
      }

      // Get today's appointments
      const { data: todayAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_time,
          status,
          type,
          patient:patients(name),
          doctor:doctors(name)
        `)
        .eq('appointment_date', today)
        .order('appointment_time')

      if (appointmentsError) {
        throw new Error(`Failed to fetch today's appointments: ${appointmentsError.message}`)
      }

      return {
        recentPatients: recentPatients || [],
        todayAppointments: (todayAppointments || []).map(apt => ({
          id: apt.id,
          patient_name: apt.patient?.name || 'Unknown Patient',
          doctor_name: apt.doctor?.name || 'Unknown Doctor',
          time: apt.appointment_time,
          status: apt.status,
          type: apt.type,
        })),
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Hook to get count of recently added patients
 */
export const useRecentPatientsCount = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-patients-count'],
    queryFn: async () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count, error } = await supabase
        .from('patients')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      if (error) {
        throw new Error(`Failed to fetch recent patients count: ${error.message}`)
      }

      return count || 0
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get appointment trends (last 30 days)
 */
export const useAppointmentTrends = () => {
  return useQuery({
    queryKey: ['dashboard', 'appointment-trends'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, status')
        .gte('appointment_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('appointment_date')

      if (error) {
        throw new Error(`Failed to fetch appointment trends: ${error.message}`)
      }

      // Group by date and status
      const trends = (data || []).reduce((acc, appointment) => {
        const date = appointment.appointment_date
        if (!acc[date]) {
          acc[date] = {
            total: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
            pending: 0,
          }
        }
        acc[date].total++
        acc[date][appointment.status.toLowerCase() as keyof typeof acc[typeof date]]++
        return acc
      }, {} as Record<string, { total: number; confirmed: number; completed: number; cancelled: number; pending: number }>)

      return trends
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to get revenue data (if you have billing in the future)
 */
export const useRevenueTrends = () => {
  // Placeholder for future revenue tracking
  return useQuery({
    queryKey: ['dashboard', 'revenue-trends'],
    queryFn: async () => {
      // This would connect to a billing/revenue table in the future
      // For now, return mock data structure
      return {
        thisMonth: 0,
        lastMonth: 0,
        growth: 0,
        daily: [] as Array<{ date: string; amount: number }>,
      }
    },
    enabled: false, // Disable until revenue tracking is implemented
  })
}

/**
 * Hook to get performance metrics
 */
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'performance-metrics'],
    queryFn: async () => {
      const today = new Date()
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(today.getDate() - 30)

      // Calculate various performance metrics
      const [completedAppointments, totalAppointments, avgRating] = await Promise.all([
        // Completed appointments in last 30 days
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'Completed')
          .gte('appointment_date', thirtyDaysAgo.toISOString().split('T')[0]),
        
        // Total appointments in last 30 days
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .gte('appointment_date', thirtyDaysAgo.toISOString().split('T')[0]),
        
        // Average doctor rating
        supabase
          .from('doctors')
          .select('rating')
      ])

      const completionRate = totalAppointments.count ? 
        ((completedAppointments.count || 0) / totalAppointments.count) * 100 : 0

      const averageRating = avgRating.data ? 
        avgRating.data.reduce((sum, doctor) => sum + doctor.rating, 0) / avgRating.data.length : 0

      return {
        completionRate: Math.round(completionRate * 100) / 100,
        averageRating: Math.round(averageRating * 10) / 10,
        totalAppointments: totalAppointments.count || 0,
        completedAppointments: completedAppointments.count || 0,
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to get system alerts/notifications
 */
export const useSystemAlerts = () => {
  return useQuery({
    queryKey: ['dashboard', 'system-alerts'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]
      const alerts = []

      // Check for appointments without confirmations (pending > 24 hours)
      const { data: pendingAppointments } = await supabase
        .from('appointments')
        .select('id, created_at, patient:patients(name)')
        .eq('status', 'Pending')
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (pendingAppointments && pendingAppointments.length > 0) {
        alerts.push({
          id: 'pending-appointments',
          type: 'warning',
          title: 'Pending Appointments',
          message: `${pendingAppointments.length} appointment(s) have been pending for more than 24 hours`,
          count: pendingAppointments.length,
        })
      }

      // Check for today's appointments
      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', today)

      if (todayAppointments && todayAppointments.length > 0) {
        alerts.push({
          id: 'today-appointments',
          type: 'info',
          title: 'Today\'s Schedule',
          message: `You have ${todayAppointments.length} appointment(s) scheduled for today`,
          count: todayAppointments.length,
        })
      }

      // Check for doctors with no availability
      const { data: unavailableDoctors } = await supabase
        .from('doctors')
        .select('id, name')
        .eq('status', 'Off Duty')

      if (unavailableDoctors && unavailableDoctors.length > 0) {
        alerts.push({
          id: 'unavailable-doctors',
          type: 'warning',
          title: 'Unavailable Doctors',
          message: `${unavailableDoctors.length} doctor(s) are currently off duty`,
          count: unavailableDoctors.length,
        })
      }

      return alerts
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}