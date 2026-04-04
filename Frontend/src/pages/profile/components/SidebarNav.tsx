import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/custom/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/utils'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: JSX.Element
  }[]
}

export default function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')

  const handleSelect = (e: string) => {
    setVal(e)
    navigate(e)
  }

  return (
    <>
      <div className='p-1 md:hidden'>
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span className='text-md'>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className=' hidden h-screen w-full border-l-[1px] border-l-[#E0E0E0] bg-white px-1 pb-8 md:block'>
        <nav className={cn('flex space-x-2  lg:flex-col lg:space-x-0 lg:space-y-1 ', className)} {...props}>
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                buttonVariants({ variant: 'none' }),

                'inline-flex h-12 items-center justify-start gap-2 self-stretch rounded-lg p-2.5  text-xs font-semibold capitalize tracking-tight  text-zinc-600',
                pathname === item.href ? 'bg-violet-500/10 text-[#7A58E7] hover:bg-violet-500/10' : ''
              )}
            >
              {/* <span className='mr-2'>{item.icon}</span> */}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
