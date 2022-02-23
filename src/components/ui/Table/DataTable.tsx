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
  data: Paginate<T>;
  items?: Array<T>;
  classTable?: string;
  classThead?: string;
  isLoading?: boolean;
  isTablePaginate?: boolean;
  selectedRows?: Record<IdType<T>, boolean>;
  selectedSort?: Array<SortingRule<T>>;
  onSelectedRowsChanged?: (rows: Record<IdType<T>, boolean>) => void;
  onSelectedSortChanged?: (sort: SortingRule<T>[]) => void;
  actions?: React.ReactNode;
  addOns?: React.ReactNode;
  filters?: React.ReactNode;
  paginateParams?: PaginateParams;
  hiddenColumns?: Array<string>;
  disabledRowIds?: string[];
  onPageSizeChanged?: (pageSize: number) => void;
  onSearch?: (search: string) => void;
  onChangePage?: (page?: number | string) => void;
}

function DataTable<T extends object = {}>({
  columns,
  data,
  items = [],
  classTable,
  classThead,
  isLoading = false,
  isTablePaginate = true,
  selectedRows,
  selectedSort = [],
  onSelectedRowsChanged,
  onSelectedSortChanged,
  actions,
  addOns,
  filters,
  paginateParams = {},
  hiddenColumns = [],
  disabledRowIds = [],
  onPageSizeChanged,
  onSearch,
  onChangePage,
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
      data: isTablePaginate ? data.items : items,
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
        {(filters || actions || addOns || onChangePage) && isTablePaginate && (
          <Filter
            onPageSizeChanged={onPageSizeChanged}
            onSearch={onSearch}
            actions={selectedRowKes.length > 0 && actions}
            addOns={addOns}
            filters={filters}
            paginateParams={paginateParams}
          />
        )}
        <Table
          {...getTableProps()}
          className={classTable || 'table-admin'}
          responsive
        >
          <thead className={classThead}>
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
      {isTablePaginate && onChangePage && (
        <PaginationTable
          paging={data.paging}
          totalItems={data.items?.length}
          search={paginateParams}
          siblingCount={1}
          onChangePage={onChangePage}
        />
      )}
    </>
  );
}

export default DataTable;

type UsePaginateParamsReturn = {
  params: PaginateParams;
  setPageNumber: Dispatch<SetStateAction<number | string | undefined>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setFilters: Dispatch<SetStateAction<Record<string, any> | undefined>>;
  setSortingRules: (sortingRules: SortingRule<unknown>[]) => void;
  setFiltersParams: (label: string, value: string | number | undefined) => void;
};

export const usePaginateParams = (): UsePaginateParamsReturn => {
  const [pageNumber, setPageNumber] = useState<number | string>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [order, setOrder] = useState<string>();
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>();
  const [filters, setFilters] = useState<Record<string, any>>();

  const setSortingRules = (sortingRules: SortingRule<unknown>[]) => {
    setOrder(
      (sortingRules.length > 0 && decamelize(sortingRules[0].id)) || undefined
    );
    setOrderBy(
      (sortingRules.length > 0 && sortingRules[0].desc ? 'desc' : 'asc') ||
        undefined
    );
  };

  const setFiltersParams = (
    label: string,
    value: string | number | undefined
  ) => {
    setFilters((prevState) => ({ ...prevState, [label]: value }));
  };

  return {
    params: {
      pageNumber,
      pageSize,
      search,
      order,
      orderBy,
      ...filters,
    },
    setPageNumber,
    setPageSize,
    setSearch,
    setFilters,
    setSortingRules,
    setFiltersParams,
  };
};
