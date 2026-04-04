import React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page?: number
  pageSize?: number
  totalPages?: number
  totalCount?: number
  loading?: boolean
  onPageChange?: (page: number) => void
  onRowClicked?: (params: any) => void
  showPagination?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page = 1,
  pageSize = 10,
  totalPages = 0,
  totalCount = 0,
  loading = false,
  onPageChange,
  onRowClicked,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: totalPages,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className='w-full'>
      {/* TABLE */}
      <div className='w-full overflow-x-auto rounded-lg border lg:overflow-visible'>
        <Table className='w-full table-fixed'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='h-10 px-4 py-2'
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className='cursor-pointer hover:bg-muted/50'
                  onClick={() => onRowClicked && onRowClicked({ data: row.original })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='whitespace-nowrap px-4 py-3 font-normal text-foreground'
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:py-4'>
          <span className='text-sm text-muted-foreground'>
            {Object.keys(table.getState().rowSelection).length} of {totalCount} row(s) selected.
          </span>

          <div className='flex items-center gap-2 sm:justify-center'>
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className='rounded border px-3 py-1 text-sm disabled:opacity-50'
            >
              Previous
            </button>

            <span className='text-sm'>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className='rounded border px-3 py-1 text-sm disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
