import { ReactNode } from 'react'
import TopNav from './TopNav'
import { useRealtimeUpdates } from '../hooks/useRealtime'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  // Enable real-time updates for the entire application
  useRealtimeUpdates()

  return (
    <div className="min-h-screen bg-warm-gray-50">
      <TopNav />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout