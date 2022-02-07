export interface Paging {
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  totalItems: number;
}

export interface Search {
  search: string;
  pageNumber: number;
  pageSize: number;
  status: string;
  order: string;
  orderBy: string;
  sort: boolean;
}
