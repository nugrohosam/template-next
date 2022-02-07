export interface ResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ResponseError {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: {
    code: number;
    message: {
      [key: string]: string;
    };
  } | null;
}

export interface PaginateParams {
  pageNumber?: number | string;
  pageSize?: number;
  orderBy?: 'asc' | 'desc';
  order?: string;
  search?: string;
  // TODO: Need filter params
  filters?: Record<string, any>;
}

interface Link {
  href: string;
  rel: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
}

export interface Paginate<T> {
  paging: {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  links: Link[];
  items: T[];
}
