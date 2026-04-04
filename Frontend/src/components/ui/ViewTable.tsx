/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { AgGridReact, AgGridReactProps, AgReactUiProps } from 'ag-grid-react'
import { CellClickedEvent, ColDef, SortChangedEvent } from 'ag-grid-community'
import React, { PropsWithChildren, useCallback } from 'react'
import { Box } from '@chakra-ui/react'
import { useTheme } from '../theme-provider'

export type ColumnEvent = {
  colId: string
  sort?: 'asc' | 'desc' | null
  value?: string | number | null
}

export interface ViewTableProps extends AgGridReactProps, AgReactUiProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onCellClick?: (event: CellClickedEvent<any>) => void
  onSelection?: (event: any) => void
  //   onSearch?: (filter: ColumnEvent) => void;
  onSort?: (sort: SortChangedEvent) => void
}

// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
export const ViewTable: React.FC<ViewTableProps> = React.forwardRef<
  HTMLTableElement,
  PropsWithChildren<ViewTableProps>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>((props, ref: any) => {
  const { theme } = useTheme()
  const { onCellClick, onSelection, onSort, columnDefs } = props
  const onSelectionChanged = useCallback(() => {
    return (
      ref.current &&
      onSelection &&
      onSelection(ref.current.api.getSelectedRows())
    )
  }, [onSelection, ref])

  return (
    <Box
      className={`${theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'} h-[330px] w-[100%]`}>
      <AgGridReact
        ref={ref}
        onCellClicked={onCellClick}
        onSelectionChanged={onSelectionChanged}
        onSortChanged={onSort}
        debounceVerticalScrollbar={true}
        defaultColDef={{
          sortable: true,
          resizable: true,
          flex: 1,
          unSortIcon: true,
          suppressSizeToFit: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            supressFilterButton: true,
          },
          suppressFiltersToolPanel: true,
          ...props.defaultColDef,
        }}
        autoSizeStrategy={{
          type: 'fitGridWidth',
          defaultMinWidth: 100,
        }}
        //domLayout="autoHeight"
        pagination={true}
        columnDefs={columnDefs?.map((value: ColDef) => ({ ...value }))}
        {...props}
      />
    </Box>
  )
})
