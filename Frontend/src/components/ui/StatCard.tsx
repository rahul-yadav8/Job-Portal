import React from 'react'

interface StatCardProps {
  title: string
  count: number
  description: string
  icon: React.ReactNode
  iconBgColor?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, count, description, icon }) => (
  <div className='relative rounded-xl border border-[#E5E7EB] px-6 pb-3 pt-6'>
    <p className=' pb-2 text-sm font-normal leading-5 text-[#333]'>{title}</p>
    <div className='flex flex-col gap-3'>
      <h3 className=' p-0 text-2xl font-semibold leading-normal text-[#333]'>{count}</h3>
      <p className=' text-[12px] font-normal leading-5 text-[#4B5563]'>{description}</p>
    </div>

    <div className='absolute right-6 top-6'>{icon}</div>
  </div>
)

export default StatCard
