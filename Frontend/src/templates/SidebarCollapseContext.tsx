import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react'

interface SidebarCollapseContextType {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

const SidebarCollapseContext = createContext<SidebarCollapseContextType | undefined>(undefined)

export const SidebarCollapseProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // useEffect(() => {
  //   const stored = localStorage.getItem('collapsed-sidebar')
  //   if (stored !== null) {
  //     setIsCollapsed(JSON.parse(stored) || false)
  //   }
  // }, [])

  // useEffect(() => {
  //   localStorage.setItem('collapsed-sidebar', JSON.stringify(isCollapsed))
  // }, [isCollapsed])

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 768) {
  //       setIsCollapsed(true)
  //     }
  //   }

  //   handleResize()
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [])

  return (
    <SidebarCollapseContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarCollapseContext.Provider>
  )
}

export const useSidebarCollapse = () => {
  const context = useContext(SidebarCollapseContext)
  if (!context) throw new Error('useSidebarCollapse must be used inside SidebarCollapseProvider')
  return context
}
