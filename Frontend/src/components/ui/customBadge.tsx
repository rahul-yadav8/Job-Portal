import React from 'react'

interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  booked: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  inprogress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  cancelled: {
    bg: 'bg-red-300',
    text: 'text-red-700',
    dot: 'bg-red-700',
  },
  request: {
    bg: 'bg-yellow-200',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  none: {
    bg: 'bg-grey-300',
    text: 'text-grey-700',
    dot: 'bg-grey-700',
  },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const key = status?.toLowerCase() || 'default'
  const style = statusStyles[key] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${style.bg} ${style.text}`}
    >
      <span className={`mr-2 h-2 w-2 rounded-full ${style.dot}`}></span>
      {status}
    </div>
  )
}
