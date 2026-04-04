'use client'

import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from '../custom/button'
import { cn } from '@/lib/utils'

interface MultiSelectProps {
  label?: string
  options: { value: string; label: string }[]
  selected: string[]
  setSelected: (selected: string[]) => void
  placeholder?: string
  width?: string
  height?: string
  className?: string
  enableSearch?: boolean
}

export default function MultiSelect({
  label,
  options = [],
  selected = [],
  setSelected,
  width,
  height,
  placeholder = 'Select...',
  className,
  enableSearch = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [tempSelected, setTempSelected] = React.useState<string[]>([])

  React.useEffect(() => {
    if (open) {
      setTempSelected(selected)
    }
  }, [open, selected])

  const handleToggle = (value: string) => {
    if (value === 'All') {
      if (tempSelected.includes('All')) {
        setTempSelected([])
      } else {
        setTempSelected(['All'])
      }
    } else {
      const newSelected = tempSelected.includes(value)
        ? tempSelected.filter((v) => v !== value)
        : [...tempSelected.filter((v) => v !== 'All'), value]
      setTempSelected(newSelected)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    setTempSelected([])
    setSelected([])
    setSearch('')
    setOpen(false)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault()
    setSelected(tempSelected)
    setOpen(false)
  }

  const handleClearSearch = () => {
    setSearch('')
  }

  const getDisplayText = () => {
    if (selected.length === 0) return null
    if (selected.length === 1) {
      return options.find((o) => o.value === selected[0])?.label
    }
    return `${selected.length} ${placeholder}`
  }

  const displayText = getDisplayText()

  const filteredOptions = enableSearch
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && <label className='text-sm font-medium leading-tight text-slate-600'>{label}</label>}
      <SelectPrimitive.Root open={open} onOpenChange={setOpen}>
        <SelectPrimitive.Trigger
          onFocus={(e) => e.preventDefault()}
          className={cn(
            'flex h-[42px] w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border bg-transparent px-3 text-sm outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-slate-400',
            className
          )}
          style={{ width, height }}
        >
          <span
            className={`${displayText ? 'text-foreground' : 'text-placeholder'} text-sm font-medium leading-6`}
          >
            {displayText || placeholder}
          </span>

          <SelectPrimitive.Icon asChild>
            <ChevronDown className='size-4 text-slate-600' />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            onCloseAutoFocus={(e) => e.preventDefault()}
            // avoidCollisions={false}
            className='max-h-70 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            position='popper'
            sideOffset={4}
          >
            {enableSearch && (
              <div
                className='flex items-center gap-2 border-b border-slate-200 bg-white p-2'
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Search className='h-4 w-4 flex-shrink-0 text-[#93A2B7]' />
                <input
                  type='text'
                  placeholder='Search...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400'
                />
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className='flex-shrink-0 rounded p-0.5 hover:bg-slate-100'
                  >
                    <X className='h-4 w-4 text-slate-400 hover:text-slate-600' />
                  </button>
                )}
              </div>
            )}

            <SelectPrimitive.ScrollUpButton className='flex cursor-default items-center justify-center bg-white py-1'>
              <ChevronUp className='size-4' />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className='max-h-[300px] p-1'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className='relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-base capitalize outline-none focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleToggle(option.value)
                    }}
                    onPointerUp={(e) => e.preventDefault()}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    {tempSelected.includes(option.value) && (
                      <span className='absolute right-2 flex size-3.5 items-center justify-center'>
                        <Check className='h-4 w-4' />
                      </span>
                    )}
                  </SelectPrimitive.Item>
                ))
              ) : (
                <div className='p-2 text-center text-sm text-slate-400'>No results</div>
              )}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className='flex cursor-default items-center justify-center bg-white py-1'>
              <ChevronDown className='size-4' />
            </SelectPrimitive.ScrollDownButton>

            <div className='flex justify-between gap-2 border-t border-slate-200 bg-white p-2'>
              <Button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleClear(e)
                }}
                variant='outline'
                size='sm'
                className='w-full'
              >
                Clear
              </Button>
              <Button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleApply(e)
                }}
                size='sm'
                className='w-full'
                disabled={tempSelected.length === 0}
              >
                Apply
              </Button>
            </div>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
