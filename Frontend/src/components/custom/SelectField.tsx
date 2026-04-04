'use client'

import React from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectFieldProps<T> {
  label?: string
  items: { label: string; value: T }[]
  placeholder?: string
  name?: string
  value?: T
  onChange: (value?: T) => void
  className?: string
  fontStyles?: string
  width?: string
  minHeight?: string
  isDisabled?: boolean
}

export const SelectField = <T extends string | number>({
  label,
  items,
  placeholder = 'Select...',
  name,
  value,
  onChange,
  className,
  fontStyles,
  width,
  minHeight = 'min-h-10',
  isDisabled,
  ...props
}: SelectFieldProps<T>) => {
  const [open, setOpen] = React.useState(false)
  const handleSelect = (val: string) => {
    if (String(value) === val) {
      onChange(undefined)
      setOpen(false)
    } else {
      onChange(val as T)
      setOpen(false)
    }
  }

  const selectedLabel =
    Array.isArray(items) && value !== undefined
      ? items.find((i) => String(i.value) === String(value))?.label
      : undefined

  return (
    <div className='flex flex-col gap-2'>
      {label && (
        <label
          htmlFor={name}
          className='justify-start self-stretch text-sm font-medium leading-tight text-foreground'
        >
          {label}
        </label>
      )}

      <Select open={open} onOpenChange={setOpen} disabled={isDisabled}>
        <SelectTrigger
          className={cn(
            'flex min-h-11 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border bg-transparent px-3 text-sm outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
            minHeight,
            className
          )}
          style={width ? { width } : undefined}
        >
          <span
            className={cn(
              `${selectedLabel ? 'text-foreground' : 'text-placeholder'} text-sm font-medium leading-6`,
              fontStyles
            )}
          >
            {selectedLabel || placeholder}
          </span>
        </SelectTrigger>

        <SelectContent className='z-[9999] w-[var(--radix-select-trigger-width)]'>
          {items?.map((item) => (
            <SelectItem
              key={String(item.value)}
              value={String(item.value)}
              onPointerDown={(e) => {
                e.preventDefault()
                handleSelect(String(item.value))
              }}
              onPointerUp={(e) => e.preventDefault()}
              className={fontStyles}
            >
              <div className='flex w-full items-center'>
                <span className='w-full'>{item.label}</span>
                {String(item.value) === String(value) && <Check size={16} className='text-primary' />}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
