import { fetchWrapper, objectToQueryParams } from '../utils';

export class admin {
  static baseUrl = process.env.REACT_APP_BASE_API + 'admin/orders';

  static async findAll(filters) {
    const url = `${this.baseUrl}?${objectToQueryParams(filters)}`;
    return await fetchWrapper.get(url);
  }

  static async update(form) {
    return await fetchWrapper.patch(this.baseUrl, form);
  }
}
