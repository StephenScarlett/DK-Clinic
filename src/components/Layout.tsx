import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import { useRealtimeUpdates } from '../hooks/useRealtime'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  // Enable real-time updates for the entire application
  useRealtimeUpdates()

  return (
    <div className="flex min-h-screen bg-clinical-100">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default Layout