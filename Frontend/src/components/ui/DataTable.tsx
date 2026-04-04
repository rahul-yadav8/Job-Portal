import { useState, useRef, useEffect, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import ReactPaginate from 'react-paginate'
import '@/styles/agTable.css'
import Arrow from '@/assets/ArrowLeft.svg'
import { Input } from '../ui/input'
import { SelectField } from '../custom/SelectField'

interface DataTableProps<T> {
  rowData: T[]
  columnDefs: ColDef<T>[]
  pageSize?: number
  onRowClick?: (rowData: T) => void
  showPagination?: boolean
  showPerPage?: boolean
  showJumpToPage?: boolean
  resizable?: boolean
  loading?: boolean
  getRowClass?: (row: any) => string
  isFixedHeight?: boolean
}

export function DataTable<T extends object>({
  rowData,
  columnDefs,
  pageSize = 20,
  onRowClick,
  showPagination = true,
  showPerPage = true,
  showJumpToPage = true,
  resizable = false,
  isFixedHeight = false,
  loading,
  getRowClass,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSizeCount, setPageSizeCount] = useState(pageSize)
  const [goToPage, setGoToPage] = useState('')
  const gridRef = useRef<AgGridReact<T>>(null)

  const totalPages = Math.ceil(rowData.length / Number(pageSizeCount))

  const currentData = useMemo(() => {
    if (!showPagination) return rowData
    const pageSize = Number(pageSizeCount)
    const offset = currentPage * pageSize
    const endIndex = offset + pageSize
    return rowData.slice(offset, endIndex)
  }, [rowData, currentPage, pageSizeCount, showPagination])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

  const onGridReady = (params: any) => {
    if (!params?.columnApi || !params?.api) return

    const allColumnIds: string[] = []

    const columns = params.columnApi.getAllColumns()
    if (columns) {
      columns.forEach((col: any) => {
        if (col) allColumnIds.push(col.getColId())
      })

      params.columnApi.autoSizeColumns(allColumnIds, false)
    }

    params.api.sizeColumnsToFit()
  }

  const handleTableData = (e: any) => {
    if (onRowClick) onRowClick(e.data as T)
  }

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const page = Number(goToPage) - 1
    if (!isNaN(page) && page >= 0 && page < totalPages) {
      setCurrentPage(page)
      setGoToPage('')
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    const numericSize = typeof newSize === 'string' ? parseInt(newSize, 10) : newSize
    setPageSizeCount(numericSize)
    setCurrentPage(0)
  }

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0)
    }
  }, [rowData.length, totalPages, currentPage])

  const gridKey = useMemo(
    () => `grid-${columnDefs.length}-${rowData.length}`,
    [columnDefs.length, rowData.length]
  )

  const gridHeightClass = isFixedHeight ? 'h-[calc(100vh-252px)]' : 'h-auto'

  const gridDomLayout = isFixedHeight ? 'normal' : 'autoHeight'

  return (
    <div className='flex w-full flex-col gap-4'>
      <div
        className={`ag-theme-quartz custom-scrollbar ${gridHeightClass} w-full rounded-2xl border border-gray-200`}
      >
        <AgGridReact<T>
          key={gridKey}
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={currentData}
          columnDefs={columnDefs}
          loading={loading}
          rowHeight={56}
          headerHeight={48}
          suppressPaginationPanel={true}
          suppressMovableColumns={true}
          domLayout={gridDomLayout}
          getRowClass={getRowClass}
          onRowClicked={handleTableData}
          animateRows={false}
          suppressRowTransform={true}
          overlayNoRowsTemplate={`<span class="text-gray-400 text-sm">No rows to show</span>`}
          icons={{
            sortAscending: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M14 10.6666L11.3333 13.3333L8.66663 10.6666" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.3334 13.3333V2.66663" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 5.33329L4.66667 2.66663L7.33333 5.33329" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.66663 2.66663V13.3333" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
            sortDescending: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M14 10.6666L11.3333 13.3333L8.66663 10.6666" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.3334 13.3333V2.66663" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 5.33329L4.66667 2.66663L7.33333 5.33329" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.66663 2.66663V13.3333" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
            sortUnSort: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M14 10.6666L11.3333 13.3333L8.66663 10.6666" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.3334 13.3333V2.66663" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 5.33329L4.66667 2.66663L7.33333 5.33329" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.66663 2.66663V13.3333" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
          }}
          defaultColDef={{
            sortable: false,
            resizable: resizable,
            unSortIcon: true,
          }}
        />
      </div>

      {showPagination && (
        <div
          className={`flex w-full items-center overflow-visible text-xs font-normal text-zinc-800 ${showPerPage || showJumpToPage ? 'justify-between' : 'justify-center'}`}
        >
          {showPerPage && (
            <div className='flex items-center gap-2'>
              <SelectField<number>
                items={[5, 10, 20, 30, 50, 100].map((num) => ({
                  label: String(num),
                  value: num,
                }))}
                placeholder='Rows'
                className='h-8 max-h-8 gap-1 pl-3 pr-2.5'
                value={pageSizeCount}
                onChange={handlePageSizeChange}
              />
              <span className='text-sm font-medium leading-tight text-[#262626]'>Items per page</span>
            </div>
          )}
          <ReactPaginate
            // previousLabel={<Image src={Arrow} alt='prev arrow' width={24} height={24} />}
            // nextLabel={<Image src={Arrow} alt='next arrow' width={24} height={24} className='rotate-180' />}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            forcePage={currentPage}
            containerClassName='flex gap-3 items-center p-2  bg-card rounded-md'
            pageLinkClassName='h-8 w-8 flex items-center cursor-pointer justify-center rounded-lg outline-1 outline-[#E1E7EF] rounded-lg gap-2.5 px-2.5 py-2'
            activeLinkClassName='!bg-[#FFF7ED] !text-[#404040] !outline-none'
            breakLabel='...'
            previousLinkClassName='h-8 w-8 flex items-center justify-center rounded-lg outline-1 outline-[#E1E7EF] rounded aria-disabled:opacity-40 aria-disabled:pointer-events-none'
            nextLinkClassName='h-8 w-8 flex items-center justify-center rounded-lg outline-1 outline-[#E1E7EF] rounded aria-disabled:opacity-40 aria-disabled:pointer-events-none'
            renderOnZeroPageCount={null}
          />

          {showJumpToPage && (
            <form className='flex items-center gap-2' onSubmit={handleGoToPage}>
              <span className='text-sm font-medium leading-tight text-[#262626]'>Go to page</span>
              <Input
                className='h-8 max-w-10 p-1 text-center'
                type='text'
                inputMode='numeric'
                pattern='\d*'
                maxLength={4}
                value={goToPage}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d{0,4}$/.test(value)) {
                    setGoToPage(value)
                  }
                }}
              />
            </form>
          )}
        </div>
      )}
    </div>
  )
}
