import { ParsedQs } from 'qs';

export interface PaginationParams {
  page: number;
  perPage: number;
  orderBy: string;
  order: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

const DEFAULTS = {
  page: 1,
  perPage: 10,
  orderBy: 'createdAt',
  order: 'asc' as const,
};

const MAX_PER_PAGE = 100;

export function parsePaginationQuery(query: ParsedQs): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string) || DEFAULTS.page);
  const perPage = Math.min(
    MAX_PER_PAGE,
    Math.max(1, parseInt(query.perPage as string) || DEFAULTS.perPage),
  );
  const order: 'asc' | 'desc' = query.order === 'desc' ? 'desc' : 'asc';
  const orderBy = (query.orderBy as string) || DEFAULTS.orderBy;

  return { page, perPage, orderBy, order };
}

export function parseFilters(
  query: ParsedQs,
  allowed: string[],
): Record<string, unknown> {
  const filters: Record<string, unknown> = {};
  for (const key of allowed) {
    if (query[key] !== undefined) filters[key] = query[key];
  }
  return filters;
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const totalPages = total === 0 ? 0 : Math.ceil(total / params.perPage);
  return {
    data,
    meta: {
      total,
      page: params.page,
      perPage: params.perPage,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPrevPage: params.page > 1,
    },
  };
}
