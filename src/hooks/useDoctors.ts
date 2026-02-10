import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorService, Doctor, NewDoctor, DoctorUpdate } from '../services/doctorService'

// Query keys for consistent cache management
export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (filters: string) => [...doctorKeys.lists(), { filters }] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  stats: () => [...doctorKeys.all, 'stats'] as const,
}

/**
 * Hook to get all doctors
 */
export const useDoctors = () => {
  return useQuery({
    queryKey: doctorKeys.lists(),
    queryFn: doctorService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get a single doctor by ID
 */
export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to search doctors
 */
export const useSearchDoctors = (searchQuery: string) => {
  return useQuery({
    queryKey: doctorKeys.list(`search-${searchQuery}`),
    queryFn: () => doctorService.search(searchQuery),
    staleTime: 30 * 1000, // 30 seconds for search results
    enabled: searchQuery.trim().length > 0,
  })
}

/**
 * Hook to get doctors by specialization
 */
export const useDoctorsBySpecialization = (specialization: string) => {
  return useQuery({
    queryKey: doctorKeys.list(`specialization-${specialization}`),
    queryFn: () => doctorService.getBySpecialization(specialization),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!specialization,
  })
}

/**
 * Hook to get doctors by status
 */
export const useDoctorsByStatus = (status: 'Available' | 'Busy' | 'Off Duty') => {
  return useQuery({
    queryKey: doctorKeys.list(`status-${status}`),
    queryFn: () => doctorService.getByStatus(status),
    staleTime: 2 * 60 * 1000, // 2 minutes for status-based queries
  })
}

/**
 * Hook to get available doctors for a specific day
 */
export const useAvailableDoctors = (day: string) => {
  return useQuery({
    queryKey: doctorKeys.list(`available-${day}`),
    queryFn: () => doctorService.getAvailableForDay(day),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!day,
  })
}

/**
 * Hook to get doctor statistics
 */
export const useDoctorStats = () => {
  return useQuery({
    queryKey: doctorKeys.stats(),
    queryFn: doctorService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new doctor
 */
export const useCreateDoctor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (doctor: Omit<NewDoctor, 'id' | 'created_at' | 'updated_at'>) =>
      doctorService.create(doctor),
    onSuccess: (newDoctor) => {
      // Invalidate and refetch doctors list
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      
      // Add the new doctor to the cache
      queryClient.setQueryData<Doctor[]>(doctorKeys.lists(), (oldData) => {
        if (oldData) {
          return [...oldData, newDoctor].sort((a, b) => a.name.localeCompare(b.name))
        }
        return [newDoctor]
      })
    },
    onError: (error) => {
      console.error('Failed to create doctor:', error)
    },
  })
}

/**
 * Hook to update an existing doctor
 */
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Omit<DoctorUpdate, 'id' | 'updated_at'>) =>
      doctorService.update(id, data),
    onSuccess: (updatedDoctor) => {
      // Update the doctor in all relevant queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      
      // Update the specific doctor in cache
      queryClient.setQueryData<Doctor>(doctorKeys.detail(updatedDoctor.id), updatedDoctor)
      
      // Update doctor in the list cache
      queryClient.setQueryData<Doctor[]>(doctorKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.map(doctor => 
            doctor.id === updatedDoctor.id ? updatedDoctor : doctor
          ).sort((a, b) => a.name.localeCompare(b.name))
        }
        return [updatedDoctor]
      })
    },
    onError: (error) => {
      console.error('Failed to update doctor:', error)
    },
  })
}

/**
 * Hook to delete a doctor
 */
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => doctorService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the doctor from all relevant queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      
      // Remove the specific doctor from cache
      queryClient.removeQueries({ queryKey: doctorKeys.detail(deletedId) })
      
      // Remove doctor from the list cache
      queryClient.setQueryData<Doctor[]>(doctorKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.filter(doctor => doctor.id !== deletedId)
        }
        return []
      })
    },
    onError: (error) => {
      console.error('Failed to delete doctor:', error)
    },
  })
}

/**
 * Hook to update doctor status
 */
export const useUpdateDoctorStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Available' | 'Busy' | 'Off Duty' }) =>
      doctorService.update(id, { status }),
    onSuccess: (updatedDoctor) => {
      // Update all relevant queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      
      // Update the specific doctor in cache
      queryClient.setQueryData<Doctor>(doctorKeys.detail(updatedDoctor.id), updatedDoctor)
      
      // Update doctor in the list cache
      queryClient.setQueryData<Doctor[]>(doctorKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.map(doctor => 
            doctor.id === updatedDoctor.id ? updatedDoctor : doctor
          )
        }
        return [updatedDoctor]
      })
    },
    onError: (error) => {
      console.error('Failed to update doctor status:', error)
    },
  })
}

/**
 * Utility function to prefetch a doctor
 */
export const usePrefetchDoctor = () => {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: doctorKeys.detail(id),
      queryFn: () => doctorService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}

/**
 * Hook to get unique specializations
 */
export const useSpecializations = () => {
  const { data: doctors = [] } = useDoctors()
  
  const specializations = Array.from(
    new Set(doctors.map(doctor => doctor.specialization))
  ).sort()
  
  return specializations
}