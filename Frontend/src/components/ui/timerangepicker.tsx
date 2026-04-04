import React, { useState, useEffect, useRef } from 'react'
import VectorIcon from '@/assets/dashboard/Vector.svg'
import { Button } from '../custom/button'
import DeleteIcon from '@/assets/delete_icon.svg'

interface TimeRange {
  startTime: string
  endTime: string
}

interface TimeRangePickerProps {
  value: string | TimeRange[]
  onChange: (value: string | TimeRange[]) => void
  disabled?: boolean
  mode: 'string' | 'array' // Explicit value type
}

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ value, onChange, disabled, mode }) => {
  const [ranges, setRanges] = useState<TimeRange[]>([{ startTime: '00:00', endTime: '23:00' }])
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const hasInvalidRange = ranges.some((r) => r.startTime === r.endTime)

  useEffect(() => {
    if (mode === 'array') {
      if (Array.isArray(value)) {
        setRanges(value.length ? value : [{ startTime: '00:00', endTime: '23:00' }])
      }
    } else if (typeof value === 'string' && value !== 'Closed') {
      const match = value.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/)
      if (match) {
        setRanges([{ startTime: `${match[1]}:${match[2]}`, endTime: `${match[3]}:${match[4]}` }])
      }
    }
  }, [value, mode])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        const hasInvalidRange = ranges.some((r) => r.startTime === r.endTime)
        if (!hasInvalidRange) {
          const finalValue = mode === 'array' ? ranges : `${ranges[0].startTime} - ${ranges[0].endTime}`
          onChange(finalValue)
        }
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker, ranges, mode, onChange])

  const handleTimeChange = (index: number, type: 'startTime' | 'endTime', hour: string, minute: string) => {
    const updated = [...ranges]
    updated[index][type] = `${hour}:${minute}`
    setRanges(updated)
  }

  const addRange = () => {
    const newRange: TimeRange = { startTime: '00:00', endTime: '00:00' }
    const isDuplicate = ranges.some(
      (r) => r.startTime === newRange.startTime && r.endTime === newRange.endTime
    )
    if (!isDuplicate) {
      setRanges([...ranges, newRange])
    }
  }

  const hasDuplicateRange = ranges.some(
    (r, i) => ranges.findIndex((x) => x.startTime === r.startTime && x.endTime === r.endTime) !== i
  )

  const removeRange = (index: number) => {
    const updated = [...ranges]
    updated.splice(index, 1)
    setRanges(updated.length ? updated : [{ startTime: '00:00', endTime: '23:00' }])
  }

  return (
    <div className='relative' ref={pickerRef}>
      <input
        type='text'
        value={
          mode === 'array' && Array.isArray(ranges)
            ? ranges.map((r) => `${r.startTime} - ${r.endTime}`).join(', ')
            : typeof value === 'string'
              ? value
              : ''
        }
        onClick={() => !disabled && setShowPicker(true)}
        readOnly
        className='w-full cursor-pointer rounded border bg-white p-2 text-gray-900'
      />

      <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
        <img src={VectorIcon} />
      </div>

      {showPicker && (
        <div className='absolute left-0 z-10 mt-2 w-full rounded-md border border-gray-300 bg-white p-4 shadow'>
          {ranges.map((range, index) => {
            const [startHour, startMinute] = range.startTime.split(':')
            const [endHour, endMinute] = range.endTime.split(':')

            return (
              <div key={index} className='mb-4 border-b border-gray-200 pb-4'>
                <div className='flex w-full items-center gap-4 px-6 py-2'>
                  <label className='block w-[80px] text-sm text-gray-600'>Start Time</label>
                  <div className='flex gap-4'>
                    <select
                      value={startHour}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value, startMinute)}
                      className='h-[28px] w-[80px] border-b border-t border-gray-300 bg-transparent px-[10px] text-center text-gray-900 focus:outline-none'
                    >
                      {hours.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={startMinute}
                      onChange={(e) => handleTimeChange(index, 'startTime', startHour, e.target.value)}
                      className='h-[28px] w-[80px] border-b border-t border-gray-300 bg-transparent px-[10px] text-center text-gray-900 focus:outline-none'
                    >
                      {minutes.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='flex w-full items-center gap-4 px-6 py-2'>
                  <label className='block w-[80px] text-sm text-gray-600'>End Time</label>
                  <div className='flex gap-4'>
                    <select
                      value={endHour}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value, endMinute)}
                      className='h-[28px] w-[80px] border-b border-t border-gray-300 bg-transparent px-[10px] text-center text-gray-900 focus:outline-none'
                    >
                      {hours.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={endMinute}
                      onChange={(e) => handleTimeChange(index, 'endTime', endHour, e.target.value)}
                      className='h-[28px] w-[80px] border-b border-t border-gray-300 bg-transparent px-[10px] text-center text-gray-900 focus:outline-none'
                    >
                      {minutes.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className=' flex justify-end gap-2 px-6'>
                  {mode === 'array' && (
                    <Button variant='outline' type='button' onClick={() => removeRange(index)}>
                      <img src={DeleteIcon} alt='filter' />
                    </Button>
                  )}
                </div>
                {range.startTime === range.endTime && (
                  <p className='mt-1 px-6 text-sm text-red-500'>Start and end time cannot be the same</p>
                )}
                {hasDuplicateRange && (
                  <p className='mt-1 px-6 text-sm text-red-500'>Duplicate time ranges are not allowed</p>
                )}
              </div>
            )
          })}

          {mode === 'array' && (
            <div className='px-6'>
              <button type='button' onClick={addRange} className='text-sm text-blue-600 hover:underline'>
                + Add Range
              </button>
            </div>
          )}
          <div className='mt-4 flex justify-end gap-2 px-6'>
            <Button
              type='button'
              disabled={hasInvalidRange || hasDuplicateRange}
              onClick={() => {
                if (hasInvalidRange) return
                const finalValue = mode === 'array' ? ranges : `${ranges[0].startTime} - ${ranges[0].endTime}`
                onChange(finalValue)
                setShowPicker(false)
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeRangePicker