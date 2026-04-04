import { ArrowUpDown, Plus } from 'lucide-react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from '@/components/search'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/custom/button'
import { getCriticalityColor, returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, createPlantOptions } from '@/utils/constants'
import { useAsset } from './AssetsContext'
import useDebounce from '@/hooks/useDebounce'
import queryString from 'query-string'
import Location from '@/assets/table-icons/Location'
import { useAuth } from '@/routes'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import PageLayout from '@/templates/PageLayout'
import { Flex } from '@chakra-ui/react'

export default function Assets() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [plantsData, setPlantsData] = useState<any[]>([])
  const [selectedPlant, setSelectedPlant] = useState<string>('')

  const {
    state: { allPlants, allAssets },
    actions: { getAllPlants, getAllAssets },
  } = useAsset()

  const { state: UserDetails } = useAuth()

  useEffect(() => {
    getAllPlants()
  }, [])

  useEffect(() => {
    if (allPlants?.data?.length && plantsData.length === 0) {
      setPlantsData(allPlants.data)
    }
  }, [allPlants])

  useEffect(() => {
    if (allPlants?.data?.length && !selectedPlant) {
      setSelectedPlant(allPlants.data[0].id)
    }
  }, [allPlants])

  const query = queryString.parse(location.search)

  const search = (query.search as string) || ''
  const status = (query.status as string) || ''

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)

  const updateQuery = useUpdateQuery()

  useEffect(() => {
    if (!selectedPlant) return

    setIsLoading(true)

    const params: { search?: string; status?: string } = {}

    if (debouncedSearch) params.search = debouncedSearch
    if (debouncedStatus) params.status = debouncedStatus

    getAllAssets(selectedPlant, params, () => {
      setIsLoading(false)
    })
  }, [selectedPlant, debouncedSearch, debouncedStatus])

  const getPlantsOption = useMemo(() => createPlantOptions(plantsData), [plantsData])

  const columns = [
    {
      accessorKey: 'serial_number',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='text-sm text-secondary-foreground'
          >
            Serial No.
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Asset Name',
      // cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'manufacturer',
      header: 'Manufacturer',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'criticality',
      header: 'Criticality',
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return (
          <span
            className={`border ${getCriticalityColor(value)} flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold`}
          >
            {value}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      // header: 'Status',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='p-0 text-sm text-secondary-foreground hover:bg-white'
          >
            Status
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return (
          <span
            className={` border ${
              value === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
            } flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold`}
          >
            {value}
          </span>
        )
      },
    },

    {
      accessorKey: 'installation_date',
      header: 'Installation Date',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 200,
      cell: ({ getValue }: { getValue: () => string }) => {
        return (
          <div className='flex items-center gap-2 capitalize text-gray-600'>
            <Location />
            <span>{getValue()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ getValue }: any) => {
        const value = getValue()
        return <span className='text-sm'>{returnISODateStringtoRelativeTime(value)}</span>
      },
    },
  ]
  const PermissionContent =
    UserDetails?.UserDetails?.org_role !== 'standard-user'
      ? {
          icon: <Plus width={16} height={16} />,
          label: 'Create Asset',
          onClick: () => navigate(`/assets/create?plantId=${selectedPlant}`),
        }
      : null

  return (
    <PageLayout
      title='Assets Overview'
      description='Manage and monitor your plant assets'
      action={PermissionContent}
      filters={
        <>
          <Flex>
            <Search searchTerm={search} setSearchTerm={(value: string) => updateQuery({ search: value })} />
          </Flex>

          <Flex gap={3}>
            <SelectField
              items={getPlantsOption}
              placeholder='Plants'
              value={selectedPlant}
              onChange={setSelectedPlant}
            />

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
          data={allAssets.data || []}
          pageSize={5}
          loading={isLoading}
          onRowClicked={(params: any) => {
            const id = params.data.id
            navigate(`/assets?assetId=${id}&plantId=${selectedPlant}`)
          }}
        />
      </Suspense>
    </PageLayout>
  )
}
