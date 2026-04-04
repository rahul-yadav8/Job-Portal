import Navbar from '@/components/custom/Navbar'
import { ArrowUpDown, CircleX, Clock, MoreHorizontal, Plus, Repeat, RotateCcw, Trash2 } from 'lucide-react'
import { Search } from '@/components/search'
import { Suspense, useEffect, useRef, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/custom/button'
import { getStatusColor, returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, checkUserTypeMessage } from '@/utils/constants'
import { useUserManagement } from './UsersContext'
import RightDrawer from '@/components/ui/RightDrawer'
import Invite from './components/Invite'
import { Flex, useDisclosure } from '@chakra-ui/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import DeactivateModel from './components/DeactivateModel'
import useDebounce from '@/hooks/useDebounce'
import Email from '@/assets/table-icons/Email'
import queryString from 'query-string'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import PageLayout from '@/templates/PageLayout'

export default function UserManagement() {
  const {
    actions: { getUsers, SendInvite, reInvite, toggleActivityStatus },
  } = useUserManagement()

  const btnRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [UserDetails, setUserDetails] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const query = queryString.parse(location.search)

  const search = (query.search as string) || ''
  const status = (query.status as string) || ''

  const debounceSearch = useDebounce(search, 500)
  const debounceStatus = useDebounce(status, 500)

  const updateQuery = useUpdateQuery()

  useEffect(() => {
    setPage(1)
  }, [debounceSearch, debounceStatus])

  useEffect(() => {
    setIsLoading(true)

    const params: { search?: string; status?: string; page?: number } = {}

    if (debounceSearch) params.search = debounceSearch
    if (debounceStatus) params.status = debounceStatus

    params.page = page

    getUsers(params, (data) => {
      setUserDetails(data)
      setIsLoading(false)
    })
  }, [debounceSearch, debounceStatus, page])

  const columns = [
    {
      accessorKey: 'full_name',
      header: 'Full Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 300,
      cell: ({ getValue }: { getValue: () => string }) => (
        <div className='flex items-center gap-2 text-gray-600'>
          <Email />
          <span>{getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-sm text-secondary-foreground'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ getValue }: { getValue: () => string }) => {
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
      accessorKey: 'active_since',
      header: 'Active Since',
      size: 150,
      cell: ({ getValue }: { getValue: () => string }) => {
        const relativeTime = returnISODateStringtoRelativeTime(getValue())

        return (
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock className='h-4 w-4 text-blue-500' />
            <span>{relativeTime}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 100,
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
              onClick={() => {
                setSelectedUser(row.original)
                reInvite({ id: row.original.id })
              }}
              disabled={row.original.status !== 'invited'}
            >
              <Repeat className='h-4 w-4' />
              Re-invite
            </DropdownMenuItem>

            <DropdownMenuItem
              className='cursor-pointer gap-2 py-2'
              onClick={() => {
                setSelectedUser(row.original)
                setOpen(true)
              }}
              disabled={row.original.status === 'invited'}
            >
              {row.original.status === 'active' ? (
                <>
                  <CircleX className='h-4 w-4' />
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

  const handleInvitation = (data: any) => {
    setIsLoading(true)
    SendInvite(data, () => {
      onClose()
      getUsers({ page }, (data) => {
        setUserDetails(data)
      })
      setIsLoading(false)
    })
  }

  return (
    <PageLayout
      title='Super Admin Users Overview'
      description='Overview of super admins'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Invite Super Admin',
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
          data={UserDetails?.data || []}
          loading={isLoading}
          page={UserDetails?.page || page}
          pageSize={UserDetails?.page_size}
          totalPages={UserDetails?.total_pages}
          totalCount={UserDetails?.total_count}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Suspense>

      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        title='Invite Super Admin'
        description='Send an email invitation to a user.'
      >
        <Invite onSubmit={handleInvitation} isLoading={isLoading} />
      </RightDrawer>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='509px'
          title={`${checkUserTypeMessage(selectedUser.status)} User`}
          description={`This will ${checkUserTypeMessage(selectedUser.status)} the User.`}
        >
          <DeactivateModel
            handleDeactivate={() => {
              toggleActivityStatus(() => {
                getUsers({ page })
              }, selectedUser.id)

              setOpen(false)
            }}
            selectedUser={selectedUser}
          />
        </ConfirmDeleteModal>
      )}
    </PageLayout>
  )
}
