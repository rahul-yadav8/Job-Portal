import RightDrawer from '@/components/ui/RightDrawer'
import { ArrowUpDown, Clock, Plus } from 'lucide-react'
import { Search } from '@/components/search'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Flex, useDisclosure } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import InviteDrawer from './components/InviteDrawer'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/custom/button'
import { getStatusColor, returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus } from '@/utils/constants'
import { useManageUsers } from './UserContext'
import queryString from 'query-string'
import useDebounce from '@/hooks/useDebounce'
import { useAuth } from '@/routes'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import { IUserLists } from '@/types/user.interface'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from '@/components/ui/use-toast'
import Email from '@/assets/table-icons/Email'
import PageLayout from '@/templates/PageLayout'

export default function User() {
  const {
    state: { UserList, RolesList },
    actions: { getUsers, SendInvite, getRoles },
  } = useManageUsers()

  const {
    state: { UserDetails },
  } = useAuth()

  const btnRef = useRef(null)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const query = queryString.parse(location.search)

  const search = (query.search as string) || ''
  const status = (query.status as string) || ''

  const updateQuery = useUpdateQuery()

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)

  const columns: ColumnDef<IUserLists>[] = [
    {
      accessorKey: 'full_name',
      header: 'Full Name',
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue() === '' || getValue() === null ? '--' : getValue()
        return (
          <div className='flex items-center gap-2 capitalize text-gray-600'>
            <span>{value}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 300,
      cell: ({ getValue }: { getValue: () => string }) => {
        return (
          <div className='flex items-center gap-2  text-gray-600'>
            <Email />
            <span>{getValue()}</span>
          </div>
        )
      },
    },

    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='text-sm text-secondary-foreground hover:bg-white'
          >
            Status
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()
        return (
          <span
            className={` border ${getStatusColor(
              value
            )} flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold capitalize`}
          >
            {value}
          </span>
        )
      },
    },
    {
      accessorKey: 'last_login_at',
      header: 'Active Since',
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()
        const relativeTime = returnISODateStringtoRelativeTime(value)

        return (
          <div className='flex items-center gap-2 text-gray-600'>
            {relativeTime !== '--' && <Clock className='h-4 w-4 text-blue-500' />}
            <span>{relativeTime}</span>
          </div>
        )
      },
    },
  ]

  const InviteUser = (values: any) => {
    SendInvite(UserDetails.org_id, values, () => {
      onClose()
      getUsers(UserDetails.org_id, {}, () => {})
    })
  }
  useEffect(() => {
    if (!UserDetails?.org_id) return

    setIsLoading(true)

    const params: { search?: string; status?: string } = {}

    if (debouncedSearch) params.search = debouncedSearch
    if (debouncedStatus) params.status = debouncedStatus

    getUsers(UserDetails.org_id, params, () => setIsLoading(false))
    getRoles(UserDetails.org_id, () => {})
  }, [UserDetails?.org_id, debouncedSearch, debouncedStatus])

  return (
    <>
      <PageLayout
        title='Manage Users'
        description='Manage access and roles for your organization.'
        action={{
          icon: <Plus width={16} height={16} />,
          label: 'Invite User',
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
            data={UserList.data || []}
            pageSize={8}
            loading={isLoading}
            onRowClicked={(params: any) => {
              const id = params.data.id
              if (params.data.status === 'invited') {
                return toast({
                  title: 'Invitation Pending',
                  variant: 'destructive',
                  description:
                    'This user has not accepted the invitation yet. Please try again after they accept.',
                })
              }
              navigate(`/users/${id}`)
            }}
          />
        </Suspense>
        {isOpen && (
          <RightDrawer
            isOpen={isOpen}
            onClose={onClose}
            btnRef={btnRef}
            title='Invite User'
            description='Send an email invitation to a user.'
          >
            <InviteDrawer onSubmit={InviteUser} RolesList={RolesList} />
          </RightDrawer>
        )}
      </PageLayout>
    </>
  )
}
