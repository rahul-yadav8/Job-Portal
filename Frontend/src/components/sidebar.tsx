import { useEffect, useMemo, useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import Logo from '@/assets/sidebar/Logo.svg'
import { Layout } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/utils'
import useCheckActiveNav from '@/hooks/use-check-active-nav'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Logout from '@/assets/sidebar/Logout'
import { LocalStorage } from '@/services'
import { APP_ROUTES } from '@/data/sidelinks'
import { getAdminType } from '@/utils/roleConfig'
import { useAuth } from '@/routes'
import { useNavigate } from 'react-router-dom'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export default function Sidebar({ isCollapsed, setIsCollapsed, className }: SidebarProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const [navOpened, setNavOpened] = useState(false)
  const role = LocalStorage.read('role_type')
  const navigate = useNavigate()

  const {
    state: { UserDetails },
    actions: { logout },
  } = useAuth()

  // useEffect(() => {
  //   if (
  //     UserData &&
  //     ((UserData.app_role !== LocalStorage.read('role_type') &&
  //       UserData.app_role !== LocalStorage.read('role_type')) ||
  //       UserData.user_role !== LocalStorage.read('role_type'))
  //   ) {
  //     toast({
  //       title: 'Suspicious Activity Detected',
  //       description: `Your role has changed. Please log in again.`,
  //     })
  //     setTimeout(() => {
  //       LocalStorage.clear()
  //       window.location.replace('/login')
  //     }, 2000)
  //   }
  // }, [UserData])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', navOpened)
  }, [navOpened])

  const { mainRoutes, bottomRoutes } = useMemo(() => {
    const allowed = APP_ROUTES.filter((r) => r.showInSidebar && r.roles.includes(role as Role))
    return {
      mainRoutes: allowed.filter((r) => r.placement !== 'bottom'),
      bottomRoutes: allowed.filter((r) => r.placement === 'bottom'),
    }
  }, [role])

  const initials = UserDetails?.name ? `${UserDetails?.name.charAt(0)}`.toUpperCase() : 'U'

  return (
    <aside
      className={cn(
        `fixed z-20 flex w-full flex-col border border-[#E4E4E7] bg-sidebar p-2 transition-[height] md:relative md:border-r ${
          isCollapsed ? 'md:w-14' : 'md:w-64'
        }`,
        className
      )}
    >
      {/* LOGO */}
      <div className='relative flex items-center gap-2 p-2 pb-3'>
        <div className='rounded-lg bg-primary p-[10px] shadow-lg'>
          <img src={Logo} alt='Motion Grid Logo' className='h-7 w-7' draggable={false} />
        </div>

        {!isCollapsed && (
          <div className='flex flex-col '>
            <h1 className='text-base font-bold text-primary'>Job Portal</h1>
            <span className='text-[10px] text-muted-foreground'>{getAdminType(role)}</span>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          className='absolute right-2 md:hidden '
          onClick={() => setNavOpened((p) => !p)}
        >
          {navOpened ? <IconX /> : <IconMenu2 />}
        </Button>
      </div>

      <span className='hidden border-t border-[#E4E4E7] pb-2 lg:block' />

      {/* NAV AREA */}
      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        <div
          id='sidebar-menu'
          className={cn(
            'flex flex-1 flex-col overflow-hidden ',
            navOpened ? 'max-h-screen' : 'max-h-0 md:max-h-screen'
          )}
        >
          {/* SCROLL AREA */}
          <div className='flex-1 overflow-y-auto px-1 md:flex md:flex-col md:justify-between'>
            <Nav closeNav={() => setNavOpened(false)} isCollapsed={isCollapsed} links={mainRoutes} />

            {bottomRoutes.length > 0 && (
              <div className='flex flex-col gap-0.5 '>
                {' '}
                <span className='text-sm font-medium '>Settings</span>{' '}
                <Nav
                  closeNav={() => setNavOpened(false)}
                  isCollapsed={isCollapsed}
                  links={bottomRoutes}
                />{' '}
              </div>
            )}
          </div>
        </div>

        {/* PROFILE */}
        {!navOpened && (
          <div className={` hidden flex-col md:flex ${isCollapsed ? 'items-center gap-4' : 'mt-2 gap-2'}`}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={`/api/avatar/${UserDetails}`} />
                    <AvatarFallback className='bg-primary font-bold text-sidebar-primary-foreground'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side='right'>{UserDetails ? `${UserDetails?.name}` : 'User'}</TooltipContent>
                <TooltipContent side='right'>{UserDetails?.email}</TooltipContent>
              </Tooltip>
            ) : (
              <div className='flex flex-col items-center justify-start gap-2 rounded-xl border border-[#E4E4E7] bg-transparent p-[14px]  '>
                <div
                  className='flex w-full cursor-pointer items-center justify-start gap-3 px-3.5 py-2 hover:rounded-md hover:bg-secondary-foreground/10'
                  onClick={() => logout(() => {})}
                >
                  <Logout />
                  Logout
                </div>
                <div className='flex w-full cursor-pointer items-center gap-2 rounded-md bg-transparent p-2 hover:rounded-md hover:bg-secondary-foreground/10'>
                  <Avatar className='h-8 w-8 '>
                    <AvatarImage src={`/api/avatar/${UserDetails}`} />
                    <AvatarFallback className='bg-[#333] font-bold text-sidebar-primary-foreground'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid w-0 flex-1 overflow-hidden'>
                    <span className='truncate text-sm font-medium capitalize'>
                      {UserDetails ? `${UserDetails?.name}` : 'User'}
                    </span>
                    <span className='truncate text-sm font-normal'>{UserDetails?.email || ''}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Layout>
    </aside>
  )
}
