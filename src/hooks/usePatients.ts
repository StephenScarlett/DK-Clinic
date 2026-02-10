import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientService, Patient, NewPatient, PatientUpdate } from '../services/patientService'

// Query keys for consistent cache management
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (filters: string) => [...patientKeys.lists(), { filters }] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  stats: () => [...patientKeys.all, 'stats'] as const,
}

/**
 * Hook to get all patients
 */
export const usePatients = () => {
  return useQuery({
    queryKey: patientKeys.lists(),
    queryFn: patientService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get a single patient by ID
 */
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to search patients
 */
export const useSearchPatients = (searchQuery: string) => {
  return useQuery({
    queryKey: patientKeys.list(searchQuery),
    queryFn: () => patientService.search(searchQuery),
    staleTime: 30 * 1000, // 30 seconds for search results
  })
}

/**
 * Hook to get patients by status
 */
export const usePatientsByStatus = (status: 'Active' | 'Inactive') => {
  return useQuery({
    queryKey: patientKeys.list(status),
    queryFn: () => patientService.getByStatus(status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get patient statistics
 */
export const usePatientStats = () => {
  return useQuery({
    queryKey: patientKeys.stats(),
    queryFn: patientService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new patient
 */
export const useCreatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (patient: Omit<NewPatient, 'id' | 'created_at' | 'updated_at'>) =>
      patientService.create(patient),
    onSuccess: (newPatient) => {
      // Invalidate and refetch patients list
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() })
      
      // Add the new patient to the cache
      queryClient.setQueryData<Patient[]>(patientKeys.lists(), (oldData) => {
        if (oldData) {
          return [...oldData, newPatient].sort((a, b) => a.name.localeCompare(b.name))
        }
        return [newPatient]
      })
    },
    onError: (error) => {
      console.error('Failed to create patient:', error)
    },
  })
}

/**
 * Hook to update an existing patient
 */
export const useUpdatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Omit<PatientUpdate, 'id' | 'updated_at'>) =>
      patientService.update(id, data),
    onSuccess: (updatedPatient) => {
      // Update the patient in all relevant queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() })
      
      // Update the specific patient in cache
      queryClient.setQueryData<Patient>(patientKeys.detail(updatedPatient.id), updatedPatient)
      
      // Update patient in the list cache
      queryClient.setQueryData<Patient[]>(patientKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.map(patient => 
            patient.id === updatedPatient.id ? updatedPatient : patient
          ).sort((a, b) => a.name.localeCompare(b.name))
        }
        return [updatedPatient]
      })
    },
    onError: (error) => {
      console.error('Failed to update patient:', error)
    },
  })
}

/**
 * Hook to delete a patient
 */
export const useDeletePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => patientService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the patient from all relevant queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: patientKeys.stats() })
      
      // Remove the specific patient from cache
      queryClient.removeQueries({ queryKey: patientKeys.detail(deletedId) })
      
      // Remove patient from the list cache
      queryClient.setQueryData<Patient[]>(patientKeys.lists(), (oldData) => {
        if (oldData) {
          return oldData.filter(patient => patient.id !== deletedId)
        }
        return []
      })
    },
    onError: (error) => {
      console.error('Failed to delete patient:', error)
    },
  })
}

/**
 * Utility function to prefetch a patient
 */
export const usePrefetchPatient = () => {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: patientKeys.detail(id),
      queryFn: () => patientService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}