import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Props = {
  active: number
  inactive: number
}

const OrganizationStatus = ({ active, inactive }: Props) => {
  const data = [
    { name: 'Active', value: active },
    { name: 'Inactive', value: inactive },
  ]

  const COLORS = ['#0CA77D', '#F25C5C']

  return (
    <div className='w-full p-6 border border-gray-200 rounded-2xl'>
      {/* Header */}
      <div className='mb-4'>
        <h2 className='text-base font-semibold text-gray-900'>Organization Status Breakdown</h2>
        <p className='mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(10px,1vw,14px)] text-gray-500'>
          Current distribution of all registered organizations by status.
        </p>
      </div>

      {/* Pie Chart */}
      <div className='relative flex h-[199px] items-center justify-center '>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              innerRadius={70}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center number */}
        <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
          <span className='text-xl font-bold'>{active + inactive}</span>
          <span className='text-sm text-gray-500'>Organizations</span>
        </div>
      </div>

      {/* Legend */}
      <div className='flex justify-center gap-4 mt-4'>
        <div className='flex items-center gap-1'>
          <span className='h-3 w-3 rounded-full bg-[#0CA77D]'></span>
          <span className='text-sm text-gray-600'>Active</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='h-3 w-3 rounded-full bg-[#F25C5C]'></span>
          <span className='text-sm text-gray-600'>Inactive</span>
        </div>
      </div>
    </div>
  )
}

export default OrganizationStatus
