import React from 'react'

interface DropdownProps {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({ value, options, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-[100px] rounded border border-gray-300 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className='text-black'>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
