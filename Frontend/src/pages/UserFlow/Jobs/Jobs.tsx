import Navbar from '@/components/custom/Navbar'
import { ArrowUpDown, MoreHorizontal, Plus, Repeat, RotateCcw, Trash2 } from 'lucide-react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from '@/components/search'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/custom/button'
import { getCriticalityColor, returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, createPlantOptions } from '@/utils/constants'
import useDebounce from '@/hooks/useDebounce'
import queryString from 'query-string'
import Location from '@/assets/table-icons/Location'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import PageLayout from '@/templates/PageLayout'
import { Flex } from '@chakra-ui/react'

type Asset = {
  id: string
  asset_name: string
  type: string
  criticality: 'Critical' | 'Medium' | 'Low'
  status: 'Active' | 'Inactive'
  mtbf: string
  location: string
}
export default function Jobs() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [plantsData, setPlantsData] = useState<any[]>([])
  const [selectedPlant, setSelectedPlant] = useState<string>('')

  //   const {
  //     state: { allPlants, allAssets },
  //     actions: { getAllPlants, getAllAssets },
  //   } = useAsset()

  //   useEffect(() => {
  //     getAllPlants()
  //   }, [])

  //   useEffect(() => {
  //     if (allPlants?.data?.length && plantsData.length === 0) {
  //       setPlantsData(allPlants.data)
  //     }
  //   }, [allPlants])

  //   useEffect(() => {
  //     if (allPlants?.data?.length && !selectedPlant) {
  //       setSelectedPlant(allPlants.data[0].id)
  //     }
  //   }, [allPlants])

  const query = queryString.parse(location.search)

  const search = (query.search as string) || ''
  const status = (query.status as string) || ''

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)

  const updateQuery = useUpdateQuery()

  //   useEffect(() => {
  //     if (!selectedPlant) return

  //     setIsLoading(true)

  //     const params: { search?: string; status?: string } = {}

  //     if (debouncedSearch) params.search = debouncedSearch
  //     if (debouncedStatus) params.status = debouncedStatus

  //     getAllAssets(selectedPlant, params, () => {
  //       setIsLoading(false)
  //     })
  //   }, [selectedPlant, debouncedSearch, debouncedStatus])

  //   const getPlantsOption = useMemo(() => createPlantOptions(plantsData), [plantsData])

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'name',
      header: 'Job Id',
      // cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
    },
    {
      accessorKey: 'type',
      header: 'No. of Rules',
    },
    {
      accessorKey: 'manufacturer',
      header: 'Schedule',
    },
    {
      accessorKey: 'model',
      header: 'Last Run',
    },
    {
      accessorKey: 'model',
      header: 'Next Run',
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
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0 hover:bg-transparent'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-40 rounded-xl border border-border bg-secondary'>
            <DropdownMenuItem
              className='cursor-pointer gap-2 py-2'
              // onClick={() => {
              //   setSelectedUser(row.original)
              //   reInvite({ id: row.original.id })
              // }}
              disabled={row.original.status !== 'invited'}
            >
              <Repeat className='h-4 w-4' />
              Re-invite
            </DropdownMenuItem>

            <DropdownMenuItem
              className='cursor-pointer gap-2 py-2'
              // onClick={() => {
              //   setSelectedUser(row.original)
              //   setOpen(true)
              // }}
              disabled={row.original.status === 'invited'}
            >
              {row.original.status === 'active' ? (
                <>
                  <Trash2 className='h-4 w-4' />
                  Deactivate
                </>
              ) : (
                <>
                  <RotateCcw className='h-4 w-4' />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <PageLayout
      title='Jobs Overview'
      description='Schedule and run rules on selected assets'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Create Jobs',
        onClick: () => navigate(`/jobs/create`),
      }}
      filters={
        <>
          <Flex>
            <Search searchTerm={search} setSearchTerm={(value: string) => updateQuery({ search: value })} />
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
          data={[]}
          pageSize={5}
          loading={isLoading}
          onRowClicked={(params: any) => {
            const id = params.data.id
            navigate(`/jobs?jobsId=${id}`)
          }}
        />
      </Suspense>
    </PageLayout>
  )
}
