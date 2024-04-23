import { Constants } from '.';

interface paginationQueryProps {
  page: number
  limit: number
}

export const query = ({ page = 1, limit = Constants.PER_PAGE }: paginationQueryProps) => {
  return { offset: (page - 1) * limit, limit };
}

export const get = (data: any[], page = 1, perPage = Constants.PER_PAGE, total = 0) => ({
  data,
  page,
  perPage,
  pages: Math.ceil(total / perPage),
  total,
});

export const getCustom = (data: any[], page = 1, perPage = Constants.PER_PAGE, total = 0) => ({
  data: data.slice((page - 1) * perPage, page * perPage),
  page,
  perPage,
  pages: Math.ceil(total / perPage),
  total,
});