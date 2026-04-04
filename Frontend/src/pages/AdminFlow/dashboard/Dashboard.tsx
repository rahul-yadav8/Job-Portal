import Navbar from '@/components/custom/Navbar'
import { ArrowUpDown, Clock, Plus } from 'lucide-react'
import { Suspense, useState } from 'react'

import { DataTable } from '@/components/ui/data-table'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, roleOptions } from '@/utils/constants'
import { returnISODateStringtoRelativeTime } from '@/utils/helpers'
import Industry from '@/assets/table-icons/Industry'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import Card from './components/Card'
import SuccessRate from '@/assets/rulescard-icons/SuccessRate'
import FailedRules from '@/assets/rulescard-icons/FailedRules'
import Triggered from '@/assets/rulescard-icons/Triggered'
import OrganizationGrowthChart from './components/OrganizationGrowthChart'
import OrganizationStatus from './components/OrganizationStatus'
import PageLayout from '@/templates/PageLayout'
import { Flex } from '@chakra-ui/react'
import { Search } from '@/components/search'
import { useUpdateQuery } from '@/hooks/useQueryParams'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')

  const data = [
    { name: 'Aug', value: 186 },
    { name: 'Sep', value: 305 },
    { name: 'Oct', value: 237 },
    { name: 'Nov', value: 73 },
    { name: 'Dec', value: 209 },
    { name: 'Jan', value: 209 },
  ]

  const activeOrganizations = 750
  const inactiveOrganizations = 375

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ' Name',
      size: 200,
      cell: ({ getValue }: { getValue: () => string }) => (
        <div className='flex w-full min-w-0 items-center gap-2'>
          <Industry />
          <span className='truncate'>{getValue()}</span>
        </div>
      ),
      meta: {
        cellClass: 'px-6 py-3',
        headerClass: 'px-6 py-3',
      },
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      size: 200,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='p-0 text-sm text-secondary-foreground hover:bg-white'
          >
            <span>Status</span>
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()

        return (
          <span
            className={`border capitalize ${
              value === 'active'
                ? 'bg-green-50 text-green-600'
                : value === 'inactive'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-50 text-gray-600'
            } flex w-fit items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold`}
          >
            {value}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Active Since',
      size: 150,
      cell: ({ getValue }: { getValue: () => string }) => {
        const relativeTime = returnISODateStringtoRelativeTime(getValue())

        return (
          <div className='flex items-center gap-2 '>
            <Clock className='h-4 w-4 text-blue-500' />
            <span>{relativeTime}</span>
          </div>
        )
      },
    },
  ]

  const cardData = [
    {
      title: 'Total Users',
      description: '+20.1% from last month',
      count: 120,
      icon: <SuccessRate />,
    },
    {
      title: 'Active Roles',
      description: '+20.1% from last month',
      count: 8,
      icon: <FailedRules />,
    },
    {
      title: 'Invitations Sent',
      description: '+20.1% from last month',
      count: 35,
      icon: <Triggered />,
    },
  ]

  return (
    <PageLayout title='Assets Overview' description='Manage and monitor your plant assets'>
      <Card cardData={cardData} />

      <div className='flex w-full flex-col gap-5 lg:flex-row'>
        {/* Bar Chart */}
        <div className='h-80 min-w-[300px] flex-[1.8] lg:h-[352px]'>
          <OrganizationGrowthChart data={data} />
        </div>

        {/* Pie Chart */}
        <div className='h-80 min-w-[250px] flex-[1.2] lg:h-[352px]'>
          <OrganizationStatus active={activeOrganizations} inactive={inactiveOrganizations} />
        </div>
      </div>

      <div className='flex flex-col justify-between pb-3 pt-4 md:flex-row md:items-center'>
        <div className='gap-1'>
          <p className='text-base font-semibold leading-5 text-[#333]'>Organization List</p>
          <p className='text-sm font-normal leading-5 text-[#4B5563]'>Detailed view of Organization List</p>
        </div>

        <div className='flex gap-3'>
          <SelectField items={ActivationStatus} placeholder='View All' value={status} onChange={setStatus} />
        </div>
      </div>

      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable
          columns={columns}
          data={[]}
          loading={isLoading}
          //   page={organizationList?.page || page}
          //   pageSize={organizationList?.page_size}
          //   totalPages={organizationList?.total_pages}
          //   totalCount={organizationList?.total_count}
          //   onPageChange={(newPage) => setPage(newPage)}
          // onRowClicked={(params: any) => {
          //   const id = params.data.id
          //   navigate(`/organizations?organizationId=${id}`)
          // }}
        />
      </Suspense>
    </PageLayout>
  )
}
