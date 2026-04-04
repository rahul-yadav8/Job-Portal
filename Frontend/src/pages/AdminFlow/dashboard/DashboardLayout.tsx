import Dashboard from './Dashboard'
import { DashboardProvider } from './DashboardContext'

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
