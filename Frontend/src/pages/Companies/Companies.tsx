import { Flex } from '@chakra-ui/react'
import { ArrowUpDown, Clock, EllipsisVertical, Plus } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'

import { Search } from '@/components/search'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus } from '@/utils/constants'
import { returnISODateStringtoRelativeTime } from '@/utils/helpers'
import Industry from '@/assets/table-icons/Industry'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import queryString from 'query-string'
import { useUpdateQuery } from '@/hooks/useQueryParams'
import useDebounce from '@/hooks/useDebounce'
import PageLayout from '@/templates/PageLayout'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CreateCompanyModal from './components/CreateCompany'

export default function Companies() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const query = queryString.parse(location.search)
  const search = (query.search as string) || ''
  const status = (query.status as string) || ''
  const page = (query.page as string) || ''

  const debouncedSearch = useDebounce(search, 500)
  const debouncedStatus = useDebounce(status, 500)
  const debouncedPage = useDebounce(page, 500)

  const updateQuery = useUpdateQuery()

  // useEffect(() => {
  //   setIsLoading(true)

  //   const params: { search?: string; status?: string; page?: string } = {}

  //   if (debouncedSearch) params.search = debouncedSearch
  //   if (debouncedStatus) params.status = debouncedStatus
  //   if (debouncedPage) params.page = debouncedPage

  //   getAll(params, () => {
  //     setIsLoading(false)
  //   })
  // }, [debouncedSearch, debouncedStatus, debouncedPage])

  // const handleCreateOrganization = async (values: any) => {
  //   setIsLoading(true)
  //   await createOrganization(values, () => {
  //     setIsLoading(false)
  //     onClose()
  //     getAll({ page }, (data) => {})
  //   })
  // }

  const columnDefs = [
    {
      headerName: 'Logo',
      field: 'logo',
      minWidth: 160,
      flex: 1,
      cellClass: 'capitalizeText',
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      minWidth: 160,
      flex: 1,
      cellClass: 'capitalizeText',
    },
    {
      headerName: 'Location',
      field: 'location',
      minWidth: 160,
      flex: 1.5,
    },
    {
      headerName: 'Create At',
      field: 'created_at',
      minWidth: 160,
      flex: 1.5,
    },

    {
      headerName: 'Website',
      field: 'website',
      minWidth: 130,
      flex: 1,
      // sortable: true,
      //  cellRenderer: (params: any) => (
      //    <ShowStatus
      //      className='flex items-center justify-center px-3 text-sm font-medium rounded-lg h-7'
      //      status={params.value}
      //      remark=''
      //    />
      //  ),
    },
    {
      headerName: 'Job Description',
      field: 'job_description',
      minWidth: 180,
      flex: 1,
    },

    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 100,
      maxWidth: 100,
      cellClass: 'cell-center',
      headerClass: 'header-center',
      flex: 1,
      cellRenderer: (params: any) => {
        const { id, type, can_reinvite } = params.data
        const isInvitation = type === 'invitation'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='hover:bg-transparent'>
                <EllipsisVertical className='h-5 w-5 rotate-90 text-gray-600' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-[115px] p-0'>
              <DropdownMenuItem className='flex h-10 w-full rounded-none border-b border-[#E5E5E5] px-3.5'>
                <button
                  //  onClick={() => {
                  //    setEditUserModal(true)
                  //    setUserID(id)
                  //  }}
                  disabled={isInvitation}
                  className='flex w-full items-center justify-between gap-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <span className='text-sm font-medium leading-6 text-neutral-600'>Edit</span>
                  {/* <Image src={editIcon} height={20} width={20} alt='edit' /> */}
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem className='flex h-10 w-full rounded-none border-b border-[#E5E5E5] px-3.5'>
                <button
                  //  onClick={() => {
                  //    setDeleteUserModal(true)
                  //    setUserID(id)
                  //  }}
                  disabled={isInvitation}
                  className='flex w-full items-center justify-between gap-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <span className='text-sm font-medium leading-6 text-red-600'>Delete</span>
                  {/* <Image src={redTrashIcon} height={20} width={20} alt='trash' /> */}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const rowData = [
    {
      id: 1,
      logo: '',
      company_name: 'Google',
      location: 'New York, USA',
      website: 'https://google.com',
      job_description: 'Build and maintain scalable frontend systems using React.',
      type: 'employee',
      can_reinvite: true,
    },
    {
      id: 2,
      logo: '',
      company_name: 'Meta',
      location: 'San Francisco, USA',
      website: 'https://meta.com',
      job_description: 'Develop backend services using Node.js and GraphQL.',
      type: 'invitation',
      can_reinvite: false,
    },
    {
      id: 3,
      logo: '',
      company_name: 'Amazon',
      location: 'London, UK',
      website: 'https://amazon.com',
      job_description: 'Design user experiences for e-commerce platforms.',
      type: 'employee',
      can_reinvite: true,
    },
    {
      id: 4,
      logo: '',
      company_name: 'Netflix',
      location: 'Berlin, Germany',
      website: 'https://netflix.com',
      job_description: 'Build streaming UI and optimize performance.',
      type: 'employee',
      can_reinvite: true,
    },
    {
      id: 5,
      logo: '',
      company_name: 'Shopify',
      location: 'Toronto, Canada',
      website: 'https://shopify.com',
      job_description: 'Ensure product quality through testing and automation.',
      type: 'invitation',
      can_reinvite: false,
    },
    {
      id: 6,
      logo: '',
      company_name: 'Spotify',
      location: 'Remote',
      website: 'https://spotify.com',
      job_description: 'Manage cloud infrastructure and CI/CD pipelines.',
      type: 'employee',
      can_reinvite: true,
    },
  ]

  return (
    <PageLayout
      title='Company Overview'
      description='Overview Company details'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Add Company',
        onClick: () => setOpen(true),
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
        <DataTable rowData={rowData} columnDefs={columnDefs} loading={isLoading} isFixedHeight />
      </Suspense>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='529px'
          title={'Create Job'}
          description={'this is create job modal'}
        >
          <CreateCompanyModal />
        </ConfirmDeleteModal>
      )}
    </PageLayout>
  )
}
