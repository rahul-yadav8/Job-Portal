import { Link } from 'react-router-dom'
import { Button, buttonVariants } from './custom/button'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/utils'
import useCheckActiveNav from '@/hooks/use-check-active-nav'

import { useTranslations } from 'use-intl'
import { AppRoute } from '@/data/sidelinks'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: AppRoute[]
  closeNav: () => void
}

export default function Nav({ links, isCollapsed, className, closeNav }: NavProps) {
  const renderLink = (route: AppRoute) => {
    const key = `${route.title}-${route.path}`

    if (isCollapsed) {
      return <NavLinkIcon {...route} key={key} closeNav={closeNav} />
    }

    return <NavLink {...route} key={key} closeNav={closeNav} />
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group border-b py-2 transition-[max-height,padding] duration-500 md:border-none',
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className='grid gap-[2px] whitespace-pre-line group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-0'>
          {links.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  )
}

interface NavLinkProps extends AppRoute {
  closeNav: () => void
}

function NavLink({ title, icon, iconActive, path, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const t = useTranslations()

  const cleanPath = path.replace('/*', '')

  const isActive = checkActiveNav(cleanPath)

  return (
    <Link
      to={cleanPath}
      onClick={closeNav}
      className={cn(
        'relative flex items-center gap-2 rounded-lg px-[4px] text-sm font-medium hover:bg-secondary-foreground/10 data-[active=true]:bg-primary ',
        isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary '
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && <div className='absolute -left-5 top-0 h-full w-1 rounded-r-sm bg-primary' />}

      <div
        className={cn(
          'flex items-center gap-2 rounded-md p-2 font-normal',
          isActive && ' text-sidebar-primary-foreground'
        )}
      >
        {isActive ? iconActive : icon}
        <span>{t(title)}</span>
      </div>
    </Link>
  )
}

function NavLinkIcon({ title, icon, iconActive, path }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const cleanPath = path.replace('/*', '')
  const isActive = checkActiveNav(cleanPath)

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={cleanPath}
          className={cn(
            buttonVariants({
              variant: isActive ? 'activeLink' : 'ghost',
              size: 'icon',
            }),
            'h-12 w-12'
          )}
        >
          {isActive ? iconActive : icon}
          <span className='sr-only'>{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right'>{title}</TooltipContent>
    </Tooltip>
  )
}
