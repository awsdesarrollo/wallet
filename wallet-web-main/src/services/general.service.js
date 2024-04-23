import { fetchWrapper, objectToQueryParams } from '../utils';

const baseUrl = process.env.REACT_APP_BASE_API + 'general';

export const findFundsSources = async (filters) => {
  const url = `${baseUrl}/funds-sources?${objectToQueryParams(filters)}`;
  return await fetchWrapper.get(url);
}

export const findPaymentMethods = async (filters) => {
  const url = `${baseUrl}/payment-methods?${objectToQueryParams(filters)}`;
  return await fetchWrapper.get(url);
}