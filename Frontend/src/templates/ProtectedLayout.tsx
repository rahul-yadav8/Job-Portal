import Sidebar from '@/components/sidebar'
import { Box } from '@chakra-ui/react'
import { ProfileProvider } from '@/pages/profile/profileContext'
import { useSidebarCollapse } from './SidebarCollapseContext'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/routes'
import { useEffect } from 'react'
import Navbar from '@/components/custom/Navbar'

export interface ProtectedLayoutProps {
  children?: React.ReactNode
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }: ProtectedLayoutProps) => {
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse()

  const {
    actions: { getCurrentDetails },
  } = useAuth()

  useEffect(() => {
    getCurrentDetails(() => {})
  }, [])

  return (
    <ProfileProvider>
      <div className='relative flex h-screen overflow-hidden bg-background'>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main className={`w-full overflow-auto px-6 py-4`}>
          <Box id='content'>
            <Outlet />
          </Box>
        </main>
      </div>
    </ProfileProvider>
  )
}
