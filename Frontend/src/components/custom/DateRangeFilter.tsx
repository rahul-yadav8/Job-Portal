import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import DatePicker from './DatePicker'
import clsx from 'clsx'
import { cn } from '@/utils'

type DateBoxProps = {
  label: string
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  className?: string
  variant?: 'fill' | 'input'
}

export const DateRangeFilter = ({ label, value, onChange, minDate, className, variant }: DateBoxProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='flex w-full flex-col gap-[6px]'>
      <label className='text-sm font-medium text-[#333]'>Installation Date</label>
      <div ref={ref} className={clsx('relative inline-block text-left', className)}>
        <div
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'text-placeholder font-geist flex min-w-[140px] cursor-pointer items-center justify-between gap-2 text-sm  ',
            variant === 'fill'
              ? 'h-[38px] rounded-[30px] bg-[#F4F5F7] px-[12px] py-[8px]'
              : 'h-[42px] w-full rounded-md border px-3',
            className
          )}
        >
          <span className={value ? 'text-foreground' : 'text-[#6b7280]'}>
            {value ? format(value, 'yyyy-MM-dd') : label}
          </span>
          <CalendarDays size={16} className={value ? 'text-foreground' : 'text-[#606060]'} />
        </div>

        {open && (
          <div className='absolute right-1 z-10 mt-4 rounded-md bg-white shadow-lg'>
            <DatePicker
              value={value}
              onChange={(date) => {
                onChange(date)
                setOpen(false)
              }}
              minDate={minDate}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DateRangeFilter
