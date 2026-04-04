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
import CreateJobModal from './components/CreateJobModal'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Job() {
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
      headerName: 'Job Title',
      field: 'job_title',
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
      headerName: 'Category',
      field: 'category',
      minWidth: 150,
      flex: 1,
    },
    {
      headerName: 'Job Type',
      field: 'job_type',
      minWidth: 130,
      flex: 1,
      sortable: true,
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
      headerName: 'Requirement',
      field: 'requirement',
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: 'Salary Range',
      field: 'salary_range',
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
      job_title: 'Frontend Developer',
      location: 'New York, USA',
      category: 'IT',
      job_type: 'Full Time',
      job_description: 'Build and maintain user interfaces using React.',
      requirement: '2+ years experience in React, JS, CSS',
      salary_range: '$60,000 - $80,000',
      type: 'employee',
      can_reinvite: true,
    },
    {
      id: 2,
      job_title: 'Backend Developer',
      location: 'San Francisco, USA',
      category: 'IT',
      job_type: 'Part Time',
      job_description: 'Develop APIs using Node.js and Express.',
      requirement: 'Experience with Node.js, MongoDB',
      salary_range: '$50,000 - $70,000',
      type: 'invitation',
      can_reinvite: false,
    },
    {
      id: 3,
      job_title: 'UI/UX Designer',
      location: 'London, UK',
      category: 'Design',
      job_type: 'Contract',
      job_description: 'Design intuitive user experiences.',
      requirement: 'Figma, Adobe XD, UI principles',
      salary_range: '£40,000 - £60,000',
      type: 'employee',
      can_reinvite: true,
    },
    {
      id: 4,
      job_title: 'Mobile App Developer',
      location: 'Berlin, Germany',
      category: 'IT',
      job_type: 'Full Time',
      job_description: 'Build mobile apps using React Native.',
      requirement: 'React Native, Expo, API integration',
      salary_range: '€55,000 - €75,000',
      type: 'employee',
      can_reinvite: true,
    },
    {
      id: 5,
      job_title: 'QA Engineer',
      location: 'Toronto, Canada',
      category: 'Testing',
      job_type: 'Full Time',
      job_description: 'Test applications and ensure quality.',
      requirement: 'Manual + Automation testing',
      salary_range: '$45,000 - $65,000',
      type: 'invitation',
      can_reinvite: false,
    },
    {
      id: 6,
      job_title: 'DevOps Engineer',
      location: 'Remote',
      category: 'IT',
      job_type: 'Full Time',
      job_description: 'Manage CI/CD pipelines and cloud infra.',
      requirement: 'AWS, Docker, Kubernetes',
      salary_range: '$70,000 - $95,000',
      type: 'employee',
      can_reinvite: true,
    },
  ]

  return (
    <PageLayout
      title='Job Overview'
      description='Overview Job details'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Create Job',
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
          <CreateJobModal />
        </ConfirmDeleteModal>
      )}
    </PageLayout>
  )
}
