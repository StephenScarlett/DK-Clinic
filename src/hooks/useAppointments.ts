import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  appointmentService, 
  Appointment, 
  NewAppointment, 
  AppointmentUpdate, 
  AppointmentWithDetails 
} from '../services/appointmentService'

// Query keys for consistent cache management
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: string) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  stats: () => [...appointmentKeys.all, 'stats'] as const,
}

/**
 * Hook to get all appointments
 */
export const useAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: appointmentService.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to get a single appointment by ID
 */
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentService.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to get appointments by date
 */
export const useAppointmentsByDate = (date: string) => {
  return useQuery({
    queryKey: appointmentKeys.list(`date-${date}`),
    queryFn: () => appointmentService.getByDate(date),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!date,
  })
}

/**
 * Hook to get appointments by patient
 */
export const useAppointmentsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: appointmentKeys.list(`patient-${patientId}`),
    queryFn: () => appointmentService.getByPatient(patientId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!patientId,
  })
}

/**
 * Hook to get appointments by doctor
 */
export const useAppointmentsByDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: appointmentKeys.list(`doctor-${doctorId}`),
    queryFn: () => appointmentService.getByDoctor(doctorId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!doctorId,
  })
}

/**
 * Hook to get appointments by status
 */
export const useAppointmentsByStatus = (status: Appointment['status']) => {
  return useQuery({
    queryKey: appointmentKeys.list(`status-${status}`),
    queryFn: () => appointmentService.getByStatus(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to get today's appointments
 */
export const useTodayAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.list('today'),
    queryFn: appointmentService.getTodayAppointments,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Hook to get upcoming appointments
 */
export const useUpcomingAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.list('upcoming'),
    queryFn: appointmentService.getUpcoming,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to get appointment statistics
 */
export const useAppointmentStats = () => {
  return useQuery({
    queryKey: appointmentKeys.stats(),
    queryFn: appointmentService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to check for appointment conflicts
 */
export const useCheckAppointmentConflict = () => {
  return useMutation({
    mutationFn: ({ 
      doctorId, 
      date, 
      time, 
      duration, 
      excludeAppointmentId 
    }: {
      doctorId: string
      date: string
      time: string
      duration?: number
      excludeAppointmentId?: string
    }) => appointmentService.checkConflict(doctorId, date, time, duration, excludeAppointmentId),
  })
}

/**
 * Hook to create a new appointment
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (appointment: Omit<NewAppointment, 'id' | 'created_at' | 'updated_at'>) =>
      appointmentService.create(appointment),
    onSuccess: (newAppointment) => {
      // Invalidate and refetch appointment lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() })
      
      // Add the new appointment to relevant caches
      queryClient.setQueryData<AppointmentWithDetails[]>(appointmentKeys.lists(), (oldData) => {
        if (oldData) {
          return [...oldData, newAppointment].sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`)
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`)
            return dateA.getTime() - dateB.getTime()
          })
        }
        return [newAppointment]
      })
      
      // Update date-specific cache
      const appointmentDate = newAppointment.appointment_date
      queryClient.invalidateQueries({ 
        queryKey: appointmentKeys.list(`date-${appointmentDate}`)
      })
      
      // Update doctor-specific cache
      queryClient.invalidateQueries({ 
        queryKey: appointmentKeys.list(`doctor-${newAppointment.doctor_id}`)
      })
      
      // Update patient-specific cache
      queryClient.invalidateQueries({ 
        queryKey: appointmentKeys.list(`patient-${newAppointment.patient_id}`)
      })
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error)
    },
  })
}

/**
 * Hook to update an existing appointment
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Omit<AppointmentUpdate, 'id' | 'updated_at'>) =>
      appointmentService.update(id, data),
    onSuccess: (updatedAppointment) => {
      // Update the appointment in all relevant queries
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() })
      
      // Update the specific appointment in cache
      queryClient.setQueryData<AppointmentWithDetails>(
        appointmentKeys.detail(updatedAppointment.id), 
        updatedAppointment
      )
      
      // Update appointment in the list cache
      queryClient.setQueryData<AppointmentWithDetails[]>(appointmentKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.map(appointment => 
            appointment.id === updatedAppointment.id ? updatedAppointment : appointment
          ).sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`)
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`)
            return dateA.getTime() - dateB.getTime()
          })
        }
        return [updatedAppointment]
      })
    },
    onError: (error) => {
      console.error('Failed to update appointment:', error)
    },
  })
}

/**
 * Hook to update appointment status
 */
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment['status'] }) =>
      appointmentService.updateStatus(id, status),
    onSuccess: (updatedAppointment) => {
      // Update all relevant queries
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() })
      
      // Update the specific appointment in cache
      queryClient.setQueryData<AppointmentWithDetails>(
        appointmentKeys.detail(updatedAppointment.id), 
        updatedAppointment
      )
      
      // Update appointment in the list cache
      queryClient.setQueryData<AppointmentWithDetails[]>(appointmentKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.map(appointment => 
            appointment.id === updatedAppointment.id ? updatedAppointment : appointment
          )
        }
        return [updatedAppointment]
      })
    },
    onError: (error) => {
      console.error('Failed to update appointment status:', error)
    },
  })
}

/**
 * Hook to delete an appointment
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => appointmentService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the appointment from all relevant queries
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.stats() })
      
      // Remove the specific appointment from cache
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(deletedId) })
      
      // Remove appointment from the list cache
      queryClient.setQueryData<AppointmentWithDetails[]>(appointmentKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.filter(appointment => appointment.id !== deletedId)
        }
        return []
      })
    },
    onError: (error) => {
      console.error('Failed to delete appointment:', error)
    },
  })
}

/**
 * Utility function to prefetch an appointment
 */
export const usePrefetchAppointment = () => {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: appointmentKeys.detail(id),
      queryFn: () => appointmentService.getById(id),
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  }
}

/**
 * Hook to get appointment types
 */
export const useAppointmentTypes = () => {
  return [
    'Consultation',
    'Follow-up',
    'Emergency',
    'Surgery',
    'Checkup'
  ] as const
}

/**
 * Hook to get appointment priorities
 */
export const useAppointmentPriorities = () => {
  return [
    'Low',
    'Medium',
    'High'
  ] as const
}

/**
 * Hook to get appointment statuses
 */
export const useAppointmentStatuses = () => {
  return [
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled'
  ] as const
}

/**
 * Hook to get available time slots for a specific doctor on a specific date
 */
export const useAvailableTimeSlots = (doctorId: string, date: string) => {
  return useQuery({
    queryKey: [...appointmentKeys.all, 'timeSlots', doctorId, date],
    queryFn: () => appointmentService.getAvailableTimeSlots(doctorId, date),
    enabled: !!(doctorId && date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}