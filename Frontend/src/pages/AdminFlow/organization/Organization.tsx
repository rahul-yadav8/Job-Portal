import Navbar from '@/components/custom/Navbar'
import RightDrawer from '@/components/ui/RightDrawer'
import { Flex, useDisclosure } from '@chakra-ui/react'
import { ArrowUpDown, Clock, Plus } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Search } from '@/components/search'
import { DataTable } from '@/components/ui/data-table'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus } from '@/utils/constants'
import { useOrganization } from './OrganizationContext'
import OrganizationDrawer from './components/OrganizationDrawer'
import { returnISODateStringtoRelativeTime } from '@/utils/helpers'
import Industry from '@/assets/table-icons/Industry'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import queryString from 'query-string'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import useDebounce from '@/hooks/useDebounce'
import PageLayout from '@/templates/PageLayout'

export default function Organization() {
  const {
    state: { organizationList },
    actions: { getAll, createOrganization },
  } = useOrganization()
  const btnRef = useRef(null)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)

  const query = queryString.parse(location.search)
  const search = (query.search as string) || ''
  const status = (query.status as string) || ''
  const page = (query.page as string) || ''

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)
  const debouncedPage = useDebounce(page, 500)

  const updateQuery = useUpdateQuery()

  useEffect(() => {
    setIsLoading(true)

    const params: { search?: string; status?: string; page?: string } = {}

    if (debouncedSearch) params.search = debouncedSearch
    if (debouncedStatus) params.status = debouncedStatus
    if (debouncedPage) params.page = debouncedPage

    getAll(params, () => {
      setIsLoading(false)
    })
  }, [debouncedSearch, debouncedStatus, debouncedPage])

  const handleCreateOrganization = async (values: any) => {
    setIsLoading(true)
    await createOrganization(values, () => {
      setIsLoading(false)
      onClose()
      getAll({ page }, (data) => {})
    })
  }

  const columns: ColumnDef<any>[] = [
    // {
    //   accessorKey: 'id',
    //   header: 'Org ID',
    //   size: 250,
    // },
    {
      accessorKey: 'organization',
      header: 'Organization Name',
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

  return (
    <PageLayout
      title='Organizations Overview'
      description='Overview organization details'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Create Organization',
        onClick: onOpen,
      }}
      filters={
        <>
          <Flex>
            <Search searchTerm={search} setSearchTerm={(value: string) => updateQuery({ search: value })} />
          </Flex>

          <Flex gap={3}>
            <SelectField
              items={ActivationStatus}
              value={status}
              placeholder='Status'
              onChange={(value) => updateQuery({ status: value || '' })}
            />
          </Flex>
        </>
      }
    >
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable
          columns={columns}
          data={organizationList?.data || []}
          loading={isLoading}
          page={organizationList?.page || page}
          pageSize={organizationList?.page_size}
          totalPages={organizationList?.total_pages}
          totalCount={organizationList?.total_count}
          onPageChange={(newPage) => updateQuery({ page: newPage || '' })}
          onRowClicked={(params: any) => {
            const id = params.data.id
            navigate(`/organizations?organizationId=${id}`)
          }}
        />
      </Suspense>

      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        title='Create Organization'
        description='Fill the details below to create a organization.'
      >
        <OrganizationDrawer onSubmit={handleCreateOrganization} isLoading={isLoading} />
      </RightDrawer>
    </PageLayout>
  )
}
