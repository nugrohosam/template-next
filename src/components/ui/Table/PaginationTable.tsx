import { PaginateParams } from 'modules/common/types';
import { DOTS, usePagination } from 'modules/custom/usePagination';
import { Col, Pagination } from 'react-bootstrap';

import { Paging, Search } from './entities';

interface Props {
  paging: Paging;
  totalItems: number;
  search: PaginateParams;
  siblingCount: number;
  onChangePage: (page?: number | string) => void;
}

const PaginationTable: React.FC<Props> = ({
  paging,
  totalItems,
  search,
  siblingCount = 1,
  onChangePage,
}: Props) => {
  const paginationRange = usePagination({
    currentPage: (search?.pageNumber as number) || 1,
    totalCount: paging.totalItems,
    siblingCount,
    pageSize: search?.pageSize || 10,
  });

  let lastPage = paginationRange && paginationRange[paginationRange.length - 1];

  return (
    <>
      {totalItems != 0 && (
        <Col lg={12} className="d-md-flex align-items-center mt-4">
          <div className="mb-3 mb-md-0 text-center">
            <span>
              <strong className="text__blue mr-1">
                {paging.totalPages != paging.pageNumber
                  ? paging.pageNumber * paging.pageSize
                  : paging.totalItems}
              </strong>
              out of
              <strong className="text__blue mx-1">{paging.totalItems}</strong>
              data show
            </span>
          </div>
          <div className="ml-auto d-flex d-md-block">
            <Pagination className="mb-0 mx-auto">
              <Pagination.First
                disabled={search.pageNumber === 1}
                onClick={() => onChangePage(1)}
              />
              <Pagination.Prev
                disabled={search.pageNumber === 1}
                onClick={() =>
                  onChangePage(((search.pageNumber as number) || 1) - 1)
                }
              />
              {paginationRange?.map(
                (pageNumber: number | string, index: number) => {
                  if (pageNumber == DOTS) {
                    return <Pagination.Ellipsis disabled></Pagination.Ellipsis>;
                  }

                  return (
                    <Pagination.Item
                      key={index}
                      active={pageNumber == search.pageNumber}
                      onClick={() => onChangePage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                }
              )}
              {/* {[...Array(paging.totalPages).keys()].map((index) => {
                const number = index + 1;
                return (
                  <Pagination.Item
                    key={number}
                    active={number == search.pageNumber}
                    onClick={() => onChangePage(number)}
                  >
                    {number}
                  </Pagination.Item>
                );
              })} */}
              <Pagination.Next
                disabled={
                  search.pageNumber ===
                  [...Array(paging.totalPages).keys()].length
                }
                onClick={() =>
                  onChangePage(((search.pageNumber as number) || 1) + 1)
                }
              />
              <Pagination.Last
                disabled={
                  search.pageNumber ===
                  [...Array(paging.totalPages).keys()].length
                }
                onClick={() =>
                  onChangePage([...Array(paging.totalPages).keys()].length)
                }
              />
            </Pagination>
          </div>
        </Col>
      )}
    </>
  );
};

export default PaginationTable;
