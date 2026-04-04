import RightDrawer from '@/components/ui/RightDrawer'
import { Flex, useDisclosure } from '@chakra-ui/react'
import { ArrowUpDown, Clock, Plus } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import PlantsDrawer from './components/PlantsDrawer'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search } from '@/components/search'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/custom/button'
import { getStatusColor, returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { usePlant } from './PlantsContext'
import { ActivationStatus } from '@/utils/constants'
import { SelectField } from '@/components/custom/SelectField'
import useDebounce from '@/hooks/useDebounce'
import queryString from 'query-string'
import { useAuth } from '@/routes'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import Industry from '@/assets/table-icons/Industry'
import Location from '@/assets/table-icons/Location'
import Global from '@/assets/table-icons/Global'
import PageLayout from '@/templates/PageLayout'

export default function Plants() {
  const updateQuery = useUpdateQuery()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    state: { UserDetails },
  } = useAuth()

  const {
    state: { allPlants },
    actions: { getAllPlants, createPlants },
  } = usePlant()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const btnRef = useRef(null)

  const query = queryString.parse(location.search)
  const search = (query.search as string) || ''
  const status = (query.status as string) || ''

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)

  useEffect(() => {
    setPage(1)
  }, [search, status])

  useEffect(() => {
    if (!UserDetails?.org_id) return

    setIsLoading(true)

    const params: { search?: string; status?: string; page?: number } = {
      page,
    }

    if (debouncedSearch) params.search = debouncedSearch
    if (debouncedStatus) params.status = debouncedStatus

    getAllPlants(UserDetails.org_id, params, () => setIsLoading(false))
  }, [UserDetails?.org_id, debouncedSearch, debouncedStatus])

  const createPlantHandler = async (values: any) => {
    setIsLoading(true)
    await createPlants(localStorage.getItem('org_id') || '', values, {}, () => {
      onClose()
      getAllPlants(localStorage.getItem('org_id') || '')
      setIsLoading(false)
    })
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Plant Name',
      size: 200,
      cell: ({ getValue }: { getValue: () => string }) => {
        return (
          <div className='0 flex w-full min-w-0 items-center gap-2'>
            <Industry />
            <span className='truncate'>{getValue()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 120,
      cell: ({ getValue }: { getValue: () => string }) => {
        return (
          <div className='flex w-full min-w-0 items-center gap-2 capitalize '>
            <Location />
            <span className='truncate'>{getValue()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'timezone',
      header: 'TimeZone',

      size: 200,
      cell: ({ getValue }: { getValue: () => string }) => {
        return (
          <div className='flex items-center gap-2 capitalize '>
            <Global />
            <span className='truncate'>{getValue()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }: any) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 text-sm text-secondary-foreground hover:bg-white'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ getValue }: any) => {
        const value = getValue()
        return (
          <span
            className={`border ${getStatusColor(
              value
            )} flex w-fit items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold capitalize`}
          >
            {value}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()
        const relativeTime = returnISODateStringtoRelativeTime(value)

        return (
          <div className='flex w-full min-w-0 items-center gap-2'>
            <Clock className='h-4 w-4 text-blue-500' />
            <span className='truncate'>{relativeTime}</span>
          </div>
        )
      },
    },
  ]

  return (
    <PageLayout
      title='Plants Overview'
      description='Manage operational facilities and their configurations.'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Create Plant',
        onClick: () => onOpen(),
      }}
      filters={
        <>
          <Flex>
            <Search
              placeholder='Search by Name...'
              searchTerm={search}
              setSearchTerm={(value: string) => updateQuery({ search: value })}
            />
          </Flex>

          <Flex gap={3}>
            <SelectField
              items={ActivationStatus}
              placeholder='Status'
              value={status}
              onChange={(value) => updateQuery({ status: value || undefined })}
            />
          </Flex>
        </>
      }
    >
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable
          columns={columns}
          data={allPlants.data || []}
          loading={isLoading}
          page={allPlants?.page || page}
          pageSize={allPlants?.page_size}
          totalPages={allPlants?.total_pages}
          totalCount={allPlants?.total_count}
          onPageChange={(newPage) => setPage(newPage)}
          onRowClicked={(params: any) => {
            const id = params.data.id
            navigate(`/plants/${id}`)
          }}
        />
      </Suspense>
      {isOpen && (
        <RightDrawer
          isOpen={isOpen}
          onClose={onClose}
          btnRef={btnRef}
          title='Create Plant'
          description='Fill the details below to create a plant.'
        >
          <PlantsDrawer isEdit={false} isLoading={isLoading} onSubmit={createPlantHandler} />
        </RightDrawer>
      )}
    </PageLayout>
  )
}
