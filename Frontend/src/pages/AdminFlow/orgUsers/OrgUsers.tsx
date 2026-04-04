import Navbar from '@/components/custom/Navbar'
import { ArrowUpDown, Box, CircleX, Clock, MoreHorizontal, Repeat, RotateCcw, Trash2 } from 'lucide-react'
import { Search } from '@/components/search'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/custom/button'
import { returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { SelectField } from '@/components/custom/SelectField'
import {
  ActivationStatus,
  checkUserTypeMessage,
  createOrganizationOptions,
  roleOptions,
} from '@/utils/constants'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { useOrgUsers } from './OrgContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DeleteOrganizationUserModel from './components/DeleteOrganizationUserModel'
import MultiSelect from '@/components/ui/MultiSelect'
import Industry from '@/assets/table-icons/Industry'
import Email from '@/assets/table-icons/Email'
import Admin from '@/assets/table-icons/Admin'
import User from '@/assets/table-icons/User'
import queryString from 'query-string'
import useDebounce from '@/hooks/useDebounce'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import PageLayout from '@/templates/PageLayout'
import { Flex } from '@chakra-ui/react'

export default function OrgUsers() {
  const {
    state: { orgUsers },
    actions: { getOrgUsers, reInviteOrgUser, toggleActivity },
  } = useOrgUsers()
  const [isLoading, setIsLoading] = useState(false)
  const [organization, setOrganization] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [allOrganizations, setAllOrganizations] = useState<any[]>([])

  useEffect(() => {
    if (orgUsers?.data?.length && allOrganizations.length === 0) {
      setAllOrganizations(orgUsers.data)
    }
  }, [orgUsers])

  /* Reset page when filters change */

  const query = queryString.parse(location.search)

  const search = (query.search as string) || ''
  const status = (query.status as string) || ''
  const role = (query.role as string) || ''
  const page = (query.page as string) || ''

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)
  const debouncedRole = useDebounce(role, 500)
  const debouncedPage = useDebounce(page, 500)

  const updateQuery = useUpdateQuery()

  useEffect(() => {
    setIsLoading(true)

    const params: { search?: string; status?: string; role?: string; page?: string } = {}

    if (debouncedSearch) params.search = debouncedSearch
    if (debouncedStatus) params.status = debouncedStatus
    if (debouncedRole) params.role = debouncedRole
    if (debouncedPage) params.page = debouncedPage

    getOrgUsers(params, () => {
      setIsLoading(false)
    })
  }, [debouncedStatus, debouncedSearch, debouncedRole, organization, debouncedPage])

  const organizationOption = useMemo(() => createOrganizationOptions(allOrganizations), [allOrganizations])

  const confirmDeleteOrganizationUser = () => {
    if (!selectedUser) return

    toggleActivity(selectedUser.organization_id, selectedUser.user_id, () => {
      getOrgUsers({ page })
      setOpen(false)
      setSelectedUser(null)
    })
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Full Name',
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      size: 250,
      cell: ({ getValue }: { getValue: () => string }) => (
        <div className='flex items-center gap-2 truncate text-gray-600'>
          <Email />
          <span>{getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'organization_name',
      header: 'Organization',
      size: 200,
      cell: ({ getValue }: { getValue: () => string }) => (
        <div className='flex items-center gap-2 text-gray-600'>
          <Industry />
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
          className='text-sm text-secondary-foreground hover:bg-white'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
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
      accessorKey: 'org_role',
      header: 'Role',
      size: 200,
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()

        return (
          <div className='flex items-center gap-2 capitalize text-gray-600'>
            {value === 'tenant-admin' ? <Admin /> : <User />}
            <span>{value?.replace('-', ' ')}</span>
          </div>
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
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock className='h-4 w-4 text-blue-500' />
            <span>{relativeTime}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 100,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-40 rounded-xl border border-border bg-secondary p-1'>
            <DropdownMenuItem
              className='cursor-pointer gap-2 px-3 py-2 disabled:cursor-not-allowed'
              onClick={() => reInviteOrgUser(row.original.organization_id)}
              disabled={row.original.status === 'active' || row.original.status === 'inactive'}
            >
              <Repeat className='h-4 w-4' />
              Re-invite
            </DropdownMenuItem>

            <DropdownMenuItem
              className='cursor-pointer gap-2 px-3 py-2 disabled:cursor-not-allowed'
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

  return (
    <PageLayout
      title='Org Users Overview'
      description='Overview of organization users and admins.'
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

            <SelectField
              items={roleOptions}
              placeholder='Role'
              value={role}
              onChange={(value) => updateQuery({ role: value || undefined })}
            />

            <MultiSelect
              options={organizationOption}
              selected={organization}
              setSelected={setOrganization}
              placeholder='Organization'
              enableSearch
            />
          </Flex>
        </>
      }
    >
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable
          columns={columns}
          data={orgUsers?.data || []}
          loading={isLoading}
          page={orgUsers?.page || page}
          pageSize={orgUsers?.page_size}
          totalPages={orgUsers?.total_pages}
          totalCount={orgUsers?.total_count}
          onPageChange={(newPage) => updateQuery({ page: newPage || '' })}
        />
      </Suspense>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='509px'
          title={`${checkUserTypeMessage(selectedUser.status)} Organization User`}
          description={`This will ${checkUserTypeMessage(selectedUser.status)} the organization user.`}
        >
          <DeleteOrganizationUserModel
            handleDeleteOrganization={confirmDeleteOrganizationUser}
            selectedUser={selectedUser}
          />
        </ConfirmDeleteModal>
      )}
    </PageLayout>
  )
}
