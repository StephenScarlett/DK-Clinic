import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { patientKeys } from './usePatients'
import { doctorKeys } from './useDoctors'
import { appointmentKeys } from './useAppointments'

/**
 * Hook to enable real-time updates for patients
 */
export const useRealtimePatients = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('patients-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patients'
      }, (payload) => {
        console.log('Patient change detected:', payload)
        
        // Invalidate and refetch all patient-related queries
        queryClient.invalidateQueries({ queryKey: patientKeys.all })
        
        // Show a toast notification (you could add a toast library here)
        if (payload.eventType === 'INSERT') {
          console.log('New patient added!')
        } else if (payload.eventType === 'UPDATE') {
          console.log('Patient updated!')
        } else if (payload.eventType === 'DELETE') {
          console.log('Patient removed!')
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}

/**
 * Hook to enable real-time updates for doctors
 */
export const useRealtimeDoctors = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('doctors-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctors'
      }, (payload) => {
        console.log('Doctor change detected:', payload)
        
        // Invalidate and refetch all doctor-related queries
        queryClient.invalidateQueries({ queryKey: doctorKeys.all })
        
        if (payload.eventType === 'INSERT') {
          console.log('New doctor added!')
        } else if (payload.eventType === 'UPDATE') {
          console.log('Doctor updated!')
        } else if (payload.eventType === 'DELETE') {
          console.log('Doctor removed!')
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}

/**
 * Hook to enable real-time updates for appointments
 */
export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, (payload) => {
        console.log('Appointment change detected:', payload)
        
        // Invalidate and refetch all appointment-related queries
        queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
        
        // Also invalidate dashboard queries since they depend on appointments
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        
        if (payload.eventType === 'INSERT') {
          console.log('New appointment scheduled!')
        } else if (payload.eventType === 'UPDATE') {
          console.log('Appointment updated!')
        } else if (payload.eventType === 'DELETE') {
          console.log('Appointment cancelled!')
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}

/**
 * Combined hook to enable all real-time updates
 */
export const useRealtimeUpdates = () => {
  useRealtimePatients()
  useRealtimeDoctors()
  useRealtimeAppointments()
}

/**
 * Hook to monitor connection status
 */
export const useRealtimeStatus = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to Supabase realtime')
      // Optionally refetch all queries when reconnecting
      queryClient.invalidateQueries()
    }

    const handleDisconnect = () => {
      console.log('Disconnected from Supabase realtime')
    }

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          handleConnect()
        } else if (event === 'SIGNED_OUT') {
          handleDisconnect()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])
}

/**
 * Hook for specific real-time updates with custom handlers
 */
export const useCustomRealtimeUpdates = (config: {
  table: 'patients' | 'doctors' | 'appointments'
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  filter?: string
}) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    let subscriptionConfig: any = {
      event: config.event || '*',
      schema: 'public',
      table: config.table
    }

    if (config.filter) {
      subscriptionConfig.filter = config.filter
    }

    const channel = supabase
      .channel(`custom-${config.table}-changes`)
      .on('postgres_changes', subscriptionConfig, (payload) => {
        console.log(`${config.table} change:`, payload)
        
        // Call custom handlers
        switch (payload.eventType) {
          case 'INSERT':
            config.onInsert?.(payload)
            break
          case 'UPDATE':
            config.onUpdate?.(payload)
            break
          case 'DELETE':
            config.onDelete?.(payload)
            break
        }
        
        // Invalidate related queries
        const queryKey = 
          config.table === 'patients' ? patientKeys.all :
          config.table === 'doctors' ? doctorKeys.all :
          appointmentKeys.all
        
        queryClient.invalidateQueries({ queryKey })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [
    config.table, 
    config.event, 
    config.filter, 
    config.onInsert, 
    config.onUpdate, 
    config.onDelete, 
    queryClient
  ])
}

/**
 * Hook to get real-time presence (who's online)
 */
export const useRealtimePresence = (roomId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase.channel(`presence-${roomId}`, {
      config: {
        presence: {
          key: `user-${Date.now()}`
        }
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        console.log('Sync presence state:', newState)
        // You could update a presence state here
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') {
          return
        }

        // Track this user as present
        const presenceTrackStatus = await channel.track({
          user_id: 'current-user', // Replace with actual user ID when auth is implemented
          online_at: new Date().toISOString(),
        })
        
        console.log('Presence track status:', presenceTrackStatus)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])
}