/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact, AgGridReactProps, AgReactUiProps } from 'ag-grid-react'
import { CellClickedEvent, ColDef, SortChangedEvent } from 'ag-grid-community'
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useTheme } from '../theme-provider'
import Select, { SingleValue } from 'react-select'

export interface CustomDataTableProps extends AgGridReactProps, AgReactUiProps {
  [key: string]: any
  onCellClick?: (event: CellClickedEvent<any>) => void
  onSelection?: (event: any) => void
  onSort?: (sort: SortChangedEvent) => void
  // Dynamic Pagination Props
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  currentPage?: number // 1-indexed from parent
  totalRows?: number
  pageSize?: number
}

export const CustomDataTable: React.FC<CustomDataTableProps> = React.forwardRef<
  HTMLTableElement,
  PropsWithChildren<CustomDataTableProps>
>((props, ref: any) => {
  const { theme } = useTheme()
  const {
    onCellClick,
    onSelection,
    onSort,
    onPageChange,
    onPageSizeChange,
    currentPage = 1,
    totalRows = 0,
    pageSize = 20,
    columnDefs,
  } = props

  const gridRef = ref || useRef<any>(null)

  // Sync AG Grid's internal page with Parent state
  useEffect(() => {
    const api = gridRef.current?.api
    if (api) {
      const gridPage = currentPage - 1 // AG Grid is 0-indexed
      if (api.paginationGetCurrentPage() !== gridPage) {
        api.paginationGoToPage(gridPage)
      }
    }
  }, [currentPage])

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current?.api && onSelection) {
      onSelection(gridRef.current.api.getSelectedRows())
    }
  }, [onSelection])

  const totalPages = Math.ceil(totalRows / pageSize)

  const goToPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return
    onPageChange?.(pageIndex + 1) // Pass 1-indexed to parent
  }

  const getPageNumbers = (total: number, current: number) => {
    const pages = []
    const zeroBasedCurrent = current - 1
    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i)
    } else if (zeroBasedCurrent <= 3) {
      pages.push(0, 1, 2, 3, -1, total - 1)
    } else if (zeroBasedCurrent >= total - 4) {
      pages.push(0, -1, total - 4, total - 3, total - 2, total - 1)
    } else {
      pages.push(0, -1, zeroBasedCurrent - 1, zeroBasedCurrent, zeroBasedCurrent + 1, -1, total - 1)
    }
    return pages
  }

  return (
    <Box
      className={`${theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'} w-full`}
      style={{ height: 'calc(100vh - 274px)' }}
    >
      <AgGridReact
        ref={gridRef}
        onCellClicked={onCellClick}
        onSelectionChanged={onSelectionChanged}
        onSortChanged={onSort}
        headerHeight={62}
        pagination={true}
        suppressPaginationPanel={true} // We use our custom UI
        paginationPageSize={pageSize}
        columnDefs={columnDefs}
        {...props}
      />

      <Box className='mt-4 flex items-center justify-between'>
        <div className='text-sm text-gray-600'>
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRows)} of{' '}
          {totalRows} entries
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500'>Show</span>
          <Select
            className='w-[100px]'
            value={{ value: pageSize.toString(), label: pageSize.toString() }}
            onChange={(opt) => onPageSizeChange?.(Number(opt?.value))}
            options={[10, 20, 50, 100].map((size) => ({
              value: size.toString(),
              label: size.toString(),
            }))}
            menuPlacement='top'
          />
          <span className='text-sm text-gray-500'>records</span>
        </div>

        <div className='flex items-center gap-2 rounded-lg bg-white p-2'>
          <button
            onClick={() => goToPage(currentPage - 2)}
            disabled={currentPage === 1}
            className='p-1 disabled:opacity-30'
          >
            {/* Left Arrow SVG */}
            <svg width='25' height='25' viewBox='0 0 25 25' fill='none'>
              <path
                d='M13.862 17.5L9.28 13.195C8.902 12.802 8.907 12.179 9.293 11.793L13.293 7.793'
                stroke='#828282'
                strokeWidth='2'
              />
            </svg>
          </button>

          {getPageNumbers(totalPages, currentPage).map((p, i) =>
            p === -1 ? (
              <span key={i}>...</span>
            ) : (
              <button
                key={i}
                onClick={() => goToPage(p)}
                className={`h-8 w-8 rounded text-sm ${currentPage === p + 1 ? 'bg-blue-600 text-sidebar-primary-foreground' : 'bg-gray-100'}`}
              >
                {p + 1}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage)}
            disabled={currentPage === totalPages}
            className='p-1 disabled:opacity-30'
          >
            {/* Right Arrow SVG */}
            <svg width='25' height='25' viewBox='0 0 25 25' fill='none'>
              <path
                d='M11 17.5L15.7 13.2C16.1 12.8 16.1 12.2 15.7 11.8L11 7.8'
                stroke='#828282'
                strokeWidth='2'
              />
            </svg>
          </button>
        </div>
      </Box>
    </Box>
  )
})
