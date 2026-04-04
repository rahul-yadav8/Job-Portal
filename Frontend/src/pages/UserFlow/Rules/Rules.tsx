import { ArrowUpDown, Clock, Plus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Search } from '@/components/search'
import { DataTable } from '@/components/ui/data-table'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, roleOptions } from '@/utils/constants'
import { returnISODateStringtoRelativeTime } from '@/utils/helpers'
import Industry from '@/assets/table-icons/Industry'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import MultiSelect from '@/components/ui/MultiSelect'
import Card from './components/Card'
import SuccessRate from '@/assets/rulescard-icons/SuccessRate'
import FailedRules from '@/assets/rulescard-icons/FailedRules'
import Triggered from '@/assets/rulescard-icons/Triggered'
import AssetsMonitor from '@/assets/rulescard-icons/AssetsMonitor'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/templates/PageLayout'
import { Flex } from '@chakra-ui/react'
import { useUpdateQuery } from '@/hooks/useQueryParams'

export default function Rules() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')

  const navigate = useNavigate()

  const updateQuery = useUpdateQuery()

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
    {
      title: 'Pending Invites',
      description: '+20.1% from last month',
      count: 6,
      icon: <AssetsMonitor />,
    },
  ]

  return (
    <PageLayout
      title='Rules'
      description='Manage and configure automated monitoring triggers for your assets.'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Create Rules',
        onClick: () => navigate('/rules/create-rules'),
      }}
    >
      <Card cardData={cardData} />

      <div className='flex flex-col justify-between gap-3 py-4 md:flex-row md:items-center'>
        <div className='flex self-end'>
          <Search
            placeholder='Search by Name...'
            searchTerm={search}
            setSearchTerm={(value: string) => updateQuery({ search: value })}
          />
        </div>

        <div className='flex gap-3'>
          <SelectField items={ActivationStatus} placeholder='Status' value={status} onChange={setStatus} />

          <SelectField items={roleOptions} placeholder='Role' value={role} onChange={setRole} />

          <MultiSelect
            options={[]}
            // selected={organization}
            // setSelected={setOrganization}
            placeholder='Organization'
            enableSearch
          />
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
