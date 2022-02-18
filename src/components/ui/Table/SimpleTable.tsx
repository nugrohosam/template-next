/* eslint-disable react/display-name */
import { decamelize } from 'humps';
import { Paginate, PaginateParams } from 'modules/common/types';
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Col, Table } from 'react-bootstrap';
import {
  CellProps,
  Column,
  IdType,
  SortingRule,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { getAllIds } from 'utils/helpers';

import IndeterminateCheckbox from './Checkbox';
import Filter from './Filter';
import Loader from './Loader';
import PaginationTable from './PaginationTable';

interface Props<T extends object = {}> {
  columns: Array<Column<T>>;
  items?: Array<T>;
  classTable?: string;
  isLoading?: boolean;
  selectedRows?: Record<IdType<T>, boolean>;
  selectedSort?: Array<SortingRule<T>>;
  onSelectedRowsChanged?: (rows: Record<IdType<T>, boolean>) => void;
  onSelectedSortChanged?: (sort: SortingRule<T>[]) => void;
  actions?: React.ReactNode;
  addOns?: React.ReactNode;
  hiddenColumns?: Array<string>;
  disabledRowIds?: string[];
}

function SimpleTable<T extends object = {}>({
  columns,
  items = [],
  classTable,
  isLoading = false,
  selectedRows,
  selectedSort = [],
  onSelectedRowsChanged,
  onSelectedSortChanged,
  actions,
  addOns,
  hiddenColumns = [],
  disabledRowIds = [],
}: Props<T>): JSX.Element {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // selectedFlatRows,
    state: { selectedRowIds, sortBy },
    visibleColumns,
    toggleAllRowsSelected,
    toggleRowSelected,
  } = useTable(
    {
      columns,
      data: items,
      manualSortBy: true,
      initialState: {
        // selectedRowIds: selectedRows,
        sortBy: selectedSort,
        hiddenColumns: hiddenColumns,
      },
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      if (onSelectedRowsChanged) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ toggleRowSelected, isAllRowsSelected, rows }) => {
              const modifiedOnChange = (
                event: ChangeEvent<HTMLInputElement>
              ) => {
                rows.forEach((row: any) => {
                  !disabledRowIds.includes(row.original.id) &&
                    toggleRowSelected(row.id, event.currentTarget.checked);
                });
              };

              let selectableRowsInCurrentPage = 0;
              let selectedRowsInCurrentPage = 0;
              rows.forEach((row: any) => {
                row.isSelected && selectedRowsInCurrentPage++;
                !disabledRowIds.includes(row.original.id) &&
                  selectableRowsInCurrentPage++;
              });

              const disabled = selectableRowsInCurrentPage === 0;
              const checked =
                (isAllRowsSelected ||
                  selectableRowsInCurrentPage === selectedRowsInCurrentPage) &&
                !disabled;

              return (
                <>
                  <IndeterminateCheckbox
                    onChange={modifiedOnChange}
                    checked={checked}
                    disabled={disabled}
                  />
                </>
              );
            },
            Cell: ({ row }: CellProps<T>) => (
              <>
                <IndeterminateCheckbox
                  {...row.getToggleRowSelectedProps()}
                  disabled={disabledRowIds.includes((row as any).original.id)}
                />
              </>
            ),
          },
          ...columns,
        ]);
      }
    }
  );

  useEffect(() => {
    // check, if the value is the same, no need to fire the event (to avoid event looping)
    if (JSON.stringify(selectedRowIds) != JSON.stringify(selectedRows)) {
      onSelectedRowsChanged && onSelectedRowsChanged(selectedRowIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowIds, onSelectedRowsChanged]);

  useEffect(() => {
    // TODO: temporary solution. It's only work (reset the selectedRowIds when selectedRows is empty)
    if (!selectedRows || Object.keys(selectedRows as object).length == 0) {
      toggleAllRowsSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows]);

  useEffect(() => {
    onSelectedSortChanged && onSelectedSortChanged(sortBy);
  }, [sortBy, onSelectedSortChanged]);

  const selectedRowKes = useMemo(
    () => Object.keys(selectedRowIds).filter((key) => selectedRowIds[key]),
    [selectedRowIds]
  );

  return (
    <>
      <Col lg={12}>
        {(addOns || actions) && (
          <Filter
            actions={selectedRowKes.length > 0 && actions}
            addOns={addOns}
            isSearched={false}
          />
        )}
        <Table
          {...getTableProps()}
          className={classTable || 'table-admin'}
          responsive
        >
          <thead>
            {headerGroups.map((headerGroup, parent_index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={parent_index}>
                {headerGroup.headers.map((column, child_index) =>
                  column.canSort ? (
                    <th
                      {...column.getHeaderProps([
                        {
                          className: (column as any).className,
                          style: {
                            ...(column as any).style,
                            minWidth: column.minWidth,
                          },
                        },
                        column.getSortByToggleProps(),
                      ])}
                      key={child_index}
                      aria-sort={
                        column.isSorted
                          ? column.isSortedDesc
                            ? 'descending'
                            : 'ascending'
                          : 'none'
                      }
                    >
                      {column.render('Header')}
                    </th>
                  ) : (
                    <th {...column.getHeaderProps()} key={child_index}>
                      {column.render('Header')}
                    </th>
                  )
                )}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumns.length}>
                  <Loader />
                </td>
              </tr>
            ) : rows.length !== 0 ? (
              rows.map((row, parent_index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={parent_index}>
                    {row.cells.map((cell, child_index) => {
                      return (
                        <td {...cell.getCellProps()} key={child_index}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="text-center">
                  There are no data to show
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Col>
    </>
  );
}

export default SimpleTable;
