import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { Calendar, Clock, Dot, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/custom/button'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import RightDrawer from '@/components/ui/RightDrawer'
import { useNavigate, useSearchParams } from 'react-router-dom'
import OrganizationDrawer from './components/OrganizationDrawer'
import { DataTable } from '@/components/ui/data-table'
import DeleteOrganizationModel from './components/DeleteOrganizationModel'
import { useOrganization } from './OrganizationContext'
import { getRelativeTime, returnISODateStringtoRelativeTime } from '@/utils/helpers'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'

export default function OrganizationDetails() {
  const btnRef = useRef(null)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchParams] = useSearchParams()

  const {
    state: { organizationUsers, selectedOrganization },
    actions: { getAllOrganizationUsers, updateOrganization, organizationStatusUpdate },
  } = useOrganization()

  console.log('selectedOrganization', selectedOrganization)

  const organizationId = useMemo(() => {
    return searchParams.get('organizationId')
  }, [searchParams])

  useEffect(() => {
    setIsLoading(true)
    if (organizationId) {
      getAllOrganizationUsers(organizationId, () => setIsLoading(false))
    }
  }, [organizationId])

  const handleUpdateOrganization = async (values: FormValues) => {
    if (!selectedOrganization?.id) return

    await updateOrganization(
      selectedOrganization?.id,
      {
        organization: values?.organization,
        email: values?.email,
      },
      () => {
        onClose()
        getAllOrganizationUsers(selectedOrganization?.id)
      }
    )
  }

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization?.id) return

    const payload = selectedOrganization?.status === 'active' ? { status: 'inactive' } : { status: 'active' }

    await organizationStatusUpdate(selectedOrganization?.id, payload, () => {
      navigate(`/organizations`)
      setOpen(false)
    })
  }

  const BackNavigation = () => {
    navigate(`/organizations`)
  }

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },

    {
      accessorKey: 'active_since',
      header: 'Active Since',
      size: 150,
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()
        const relativeTime = returnISODateStringtoRelativeTime(value)

        return (
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock className='h-4 w-4 text-blue-500' />
            <span>{relativeTime}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()
        return (
          <span
            className={` border capitalize  ${
              value === 'active'
                ? 'bg-green-50  text-green-600'
                : value === 'inactive'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-50 text-gray-600'
            } flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold`}
          >
            {value}
          </span>
        )
      },
      size: 150,
    },
  ]

  return (
    <>
      <Box className='flex flex-col gap-1.5'>
        <Box className='flex items-center gap-1.5 text-2xl font-medium leading-5'>
          <p className='cursor-pointer text-[#71717A]' onClick={BackNavigation}>
            Organization Overview
          </p>{' '}
          <span className=' text-[#09090B]'> / {selectedOrganization?.organization}</span>
        </Box>
        <p className='text-base font-normal leading-5 text-[#71717A]'>Organization details</p>
      </Box>

      <div className='flex flex-col gap-6'>
        <Box className='mt-8 rounded-lg border p-6'>
          <Box className='flex justify-between'>
            <Box className='flex items-center gap-3'>
              <div className='flex items-center'>
                <p className='text-[28px] font-semibold leading-5 text-[#09090B]'>
                  {selectedOrganization?.organization}
                </p>
                {selectedOrganization?.status !== 'invited' && (
                  <div className='flex flex-row items-center gap-2 px-4 text-base font-medium leading-5 text-[#71717A]'>
                    <Calendar className='h-4 w-4 text-black' />
                    <div>
                      {' '}
                      <span className='pr-1'>Active Since</span>
                      {''}( {getRelativeTime(selectedOrganization?.created_at || '')} )
                    </div>
                  </div>
                )}
              </div>
            </Box>
            <Box className='flex items-center gap-3'>
              {selectedOrganization?.status !== 'invited' && (
                <Button
                  variant='outline'
                  className='h-[40px] px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
                  rightSection={<SquarePen size={16} />}
                  onClick={() => onOpen()}
                >
                  Edit Details
                </Button>
              )}

              <div
                className={` border capitalize  ${
                  selectedOrganization?.status === 'active'
                    ? 'bg-green-50  text-green-600'
                    : selectedOrganization?.status === 'inactive'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-50 text-gray-600'
                } flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold`}
              >
                {selectedOrganization?.status}
              </div>
            </Box>
          </Box>
        </Box>

        <Box className='border p-6'>
          <p className='text-textBase text-[20px] font-medium leading-5'>Organization Users</p>
          <hr className='my-5 text-[#E4E4E7]' />
          <DataTable
            columns={columns}
            data={organizationUsers}
            pageSize={5}
            loading={isLoading}
            showPagination={false}
            // onRowClicked={(params: any) => {
            //   const id = params.data.id
            //   navigate(`/organizations?organizationId=${id}`)
            // }}
          />
        </Box>
        {selectedOrganization?.status !== 'invited' && (
          <Box className='flex items-center justify-between rounded-lg border p-6'>
            <Box className='flex flex-col gap-[10px]'>
              <p
                className={`text-base font-medium leading-5 ${selectedOrganization?.status === 'active' ? 'text-destructive' : 'text-green-500'}`}
              >
                {' '}
                {checkUserTypeMessage(selectedOrganization?.status)} Organization
              </p>
              <p className='text-sm font-medium leading-5 text-[#71717A]'>
                This will permanently {checkUserTypeMessage(selectedOrganization?.status)} the Organization
                and all the related details
              </p>
            </Box>
            <Button
              className={`mt-2 h-[40px] w-[128px] self-end rounded-[6px] ${getUserTypeStyle(selectedOrganization?.status)}  text-sm font-medium text-[#FAFAFA]`}
              onClick={() => setOpen(true)}
            >
              {checkUserTypeMessage(selectedOrganization?.status)}
            </Button>
          </Box>
        )}
      </div>
      <Button
        variant='outline'
        onClick={BackNavigation}
        className='mt-6 h-[40px] w-[65px] self-end px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
      >
        Back
      </Button>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='509px'
          title={`${checkUserTypeMessage(selectedOrganization?.status)} Organization`}
          description={`This will ${checkUserTypeMessage(selectedOrganization?.status)} the organization.`}
        >
          <DeleteOrganizationModel
            handleDeleteOrganization={handleDeleteOrganization}
            selectedOrganization={selectedOrganization}
            isLoading={isLoading}
          />
        </ConfirmDeleteModal>
      )}

      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        title='Edit Organization'
        description='Edit details of the organization.'
      >
        <OrganizationDrawer
          isEdit
          defaultValues={{
            organization: selectedOrganization?.organization || '',
            email: selectedOrganization?.email || '',
          }}
          onSubmit={handleUpdateOrganization}
        />
      </RightDrawer>
    </>
  )
}
