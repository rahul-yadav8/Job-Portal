import * as React from 'react'
import { Label } from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

interface FloatingTextareaProps {
  id: string
  label: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxLength?: number
  rows?: number
}

export const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  maxLength,
  rows = 3,
}) => {
  return (
    <div className='relative flex w-full flex-col gap-[6px]'>
      <Label htmlFor={id} className='text-sm font-medium text-[#333]'>
        {label}
      </Label>

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full resize-none rounded-md border px-3 py-2 text-sm text-[#333] placeholder:text-[#6B7280] focus:border-2 focus:border-primary  focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100',
          className
        )}
      />
    </div>
  )
}
