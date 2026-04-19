import { Flex } from '@chakra-ui/react'
import { ArrowUpDown, Clock, Edit, EllipsisVertical, Plus, Trash } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import RightDrawer from '@/components/ui/RightDrawer'
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
import { useDisclosure } from '@chakra-ui/react'
import OrganizationDrawer from './components/CompanyDrawer'
import CompanyDrawer from './components/CompanyDrawer'
import { useCompany } from './CompanyContext'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import DeleteCompanyModel from './components/DeleteCompanyModel'

type Company = {
  _id: string
  companyName: string
  description: string
  website: string
  location: string
  logo: string
  userId: string[]
  createdAt: string
  updatedAt: string
}

export default function Companies() {
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState<Company | null>(null)

  const {
    state: { manageCompanyList },
    actions: { createManageCompany, getCompanies, uploadImage, updateCompany, deleteCompany },
  } = useCompany()

  // const query = queryString.parse(location.search)
  // const search = (query.search as string) || ''
  // const status = (query.status as string) || ''
  // const page = (query.page as string) || ''

  // const debouncedSearch = useDebounce(search, 500)
  // const debouncedStatus = useDebounce(status, 500)
  // const debouncedPage = useDebounce(page, 500)

  // const updateQuery = useUpdateQuery()

  useEffect(() => {
    setIsLoading(true)

    // const params: { search?: string; status?: string; page?: string } = {}

    // if (debouncedSearch) params.search = debouncedSearch
    // if (debouncedStatus) params.status = debouncedStatus
    // if (debouncedPage) params.page = debouncedPage

    getCompanies(() => {
      setIsLoading(false)
    })
  }, [])

  console.log('selectedRow', selectedRow)

  const handleCreateCompany = async (values: any) => {
    setIsLoading(true)
    try {
      const imageUrl = await uploadImage(values.logo)

      const payload = {
        companyName: values.companyName,
        description: values.description,
        location: values.location,
        website: values.website,
        logo: imageUrl,
      }

      createManageCompany(payload, () => {
        setIsLoading(false)
        onClose()
        getCompanies(() => {
          setIsLoading(false)
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateCompany = async (values: any) => {
    if (!selectedRow) return
    setIsLoading(true)

    const payload: any = {}

    if (values.companyName !== selectedRow.companyName) {
      payload.companyName = values.companyName
    }

    if (values.description !== selectedRow.description) {
      payload.description = values.description
    }

    if (values.website !== selectedRow.website) {
      payload.website = values.website
    }

    if (values.location !== selectedRow.location) {
      payload.location = values.location
    }

    // special case for logo
    if (values.logo && values.logo !== selectedRow.logo) {
      const imageUrl = await uploadImage(values.logo)
      payload.logo = imageUrl
    }

    if (Object.keys(payload).length === 0) {
      console.log('Nothing changed')
      return
    }

    try {
      await updateCompany(selectedRow._id, payload, () => setIsLoading(false))
      onClose()
      getCompanies(() => setIsLoading(false))
    } catch (error) {
      console.log(error)
    }
  }

  const confirmDeleteCompany = async () => {
    if (!selectedRow) return

    setIsLoading(true)

    try {
      await deleteCompany(selectedRow._id)

      await getCompanies()

      setOpen(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const columnDefs = [
    {
      headerName: 'Logo',
      field: 'logo',
      minWidth: 160,
      flex: 1,
      cellClass: 'capitalizeText',
      cellRenderer: (params: any) => (
        <div className='flex items-center w-full gap-2 p-2 bg-transparent rounded-md cursor-pointer hover:rounded-md hover:bg-secondary-foreground/10'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={`${params?.data?.logo}`} />
            <AvatarFallback className='bg-[#333] font-bold text-sidebar-primary-foreground'>
              {'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      headerName: 'Company Name',
      field: 'companyName',
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
      field: 'createdAt',
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
      headerName: 'Description',
      field: 'description',
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
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='hover:bg-transparent'>
                <EllipsisVertical className='w-5 h-5 text-gray-600 rotate-90' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-[115px] p-0'>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRow(params.data)
                  onOpen()
                }}
                className='flex h-10 w-full cursor-pointer rounded-none border-b border-[#E5E5E5] px-3.5'
              >
                <button className='flex items-center justify-between gap-2 disabled:cursor-not-allowed disabled:opacity-50 '>
                  <Edit className='w-4 h-4' />
                  <span className='text-sm font-medium leading-6 text-neutral-600'>Edit</span>
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setOpen(true)
                  setSelectedRow(params.data)
                }}
                className='flex h-10 w-full cursor-pointer rounded-none border-b border-[#E5E5E5] px-3.5'
              >
                <button className='flex items-center justify-between gap-2 disabled:cursor-not-allowed disabled:opacity-50'>
                  <Trash className='h-4 w-4 text-[#EF4444]' />
                  <span className='text-sm font-medium leading-6 text-red-600'>Delete</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <PageLayout
      title='Company Overview'
      description='Overview Company details'
      action={{
        icon: <Plus width={16} height={16} />,
        label: 'Add Company',
        onClick: () => {
          setSelectedRow(null)
          onOpen()
        },
      }}
      filters={
        <>
          <Flex>
            <Search searchTerm={search} setSearchTerm={(value: string) => setSearch(value)} />
          </Flex>

          <Flex gap={3}>
            <SelectField
              items={ActivationStatus}
              value={status}
              placeholder='Status'
              onChange={(value: string) => setStatus(value)}
            />
          </Flex>
        </>
      }
    >
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable
          rowData={manageCompanyList || []}
          columnDefs={columnDefs}
          loading={isLoading}
          isFixedHeight
        />
      </Suspense>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='509px'
          title={'Delete Company'}
          description={`This will delete the company.`}
        >
          <DeleteCompanyModel
            handleDeleteOrganization={confirmDeleteCompany}
            selectedUser={selectedRow?.companyName}
            loading={isLoading}
          />
        </ConfirmDeleteModal>
      )}

      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        title={selectedRow ? 'Edit Company' : 'Create Company'}
        description={
          selectedRow
            ? 'Fill the details below to edit a company.'
            : 'Fill the details below to create a company.'
        }
      >
        <CompanyDrawer
          onSubmit={selectedRow ? handleUpdateCompany : handleCreateCompany}
          isLoading={isLoading}
          defaultValues={
            selectedRow
              ? {
                  companyName: selectedRow.companyName,
                  description: selectedRow.description,
                  website: selectedRow.website,
                  location: selectedRow.location,
                  logo: selectedRow.logo,
                }
              : undefined
          }
        />
      </RightDrawer>
    </PageLayout>
  )
}
