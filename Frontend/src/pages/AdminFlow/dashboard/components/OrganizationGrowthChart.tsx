import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus } from '@/utils/constants'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  data: { name: string; value: number }[]
}

const OrganizationGrowthChart = ({ data }: Props) => {
  return (
    <div className='w-full rounded-2xl border border-gray-200 px-6 pt-6'>
      {/* Header */}
      <div className='mb-8 flex items-start justify-between '>
        <div>
          <h2 className='text-base font-semibold text-gray-900'>Organization Growth</h2>
          <p className='mt-1 text-sm text-gray-500'>Organization Growth over the last 6 months</p>
        </div>

        <SelectField items={ActivationStatus} placeholder='View All' />
      </div>

      {/* Chart */}
      <div className='h-[240px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            {/* Gradient */}
            <defs>
              <linearGradient id='barGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#4F8EF7' stopOpacity={1} />
                <stop offset='100%' stopColor='#4F8EF7' stopOpacity={0.7} />
              </linearGradient>
            </defs>

            {/* X Axis */}
            <XAxis
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />

            {/* Tooltip */}
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
              }}
            />

            {/* Bars */}
            <Bar dataKey='value' fill='url(#barGradient)' radius={[10, 10, 0, 0]} barSize={70} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OrganizationGrowthChart
