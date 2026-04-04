import { cn } from '@/utils'
import React from 'react'
import { Button } from './button'

export default function Navbar({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: { label: string; onClick?: () => void; icon?: React.ReactNode; className?: string }
}) {
  return (
    <div className='xs:flex-col flex items-center justify-between pt-20 md:pt-0'>
      <div>
        <h1 className='text-ellipsis text-wrap text-sm font-bold md:text-2xl'>{title}</h1>
        <p className='text-ellipsis text-wrap text-xs font-medium text-muted-foreground md:text-sm'>
          {description}
        </p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className={cn(
            'flex items-center gap-2 rounded-md bg-primary text-center text-sidebar-primary-foreground hover:bg-primary/80',
            action?.className
          )}
        >
          {action.icon && <span>{action.icon}</span>}
          <span className='text-center text-sm text-sidebar-primary-foreground'>{action.label}</span>
        </Button>
      )}
    </div>
  )
}
