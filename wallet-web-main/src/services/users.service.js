import { fetchWrapper, objectToQueryParams } from '../utils';

export class admin {
  static baseUrl = process.env.REACT_APP_BASE_API + 'admin/users';

  static async create(form) {
    return await fetchWrapper.post(this.baseUrl, form);
  }

  static async findOne(userId) {
    const url = `${this.baseUrl}/${userId}`;
    return await fetchWrapper.get(url);
  }

  static async findAll(filters) {
    const url = `${this.baseUrl}?${objectToQueryParams(filters)}`;
    return await fetchWrapper.get(url);
  }

  static async findAllOrders(userId, filters) {
    const url = `${this.baseUrl}/${userId}/orders?${objectToQueryParams(filters)}`;
    return await fetchWrapper.get(url);
  }

  static async findAllMovements(userId, filters) {
    const url = `${this.baseUrl}/${userId}/movements?${objectToQueryParams(filters)}`;
    return await fetchWrapper.get(url);
  }

  static async update(form) {
    return await fetchWrapper.patch(this.baseUrl, form);
  }

  static async addBalance(form) {
    return await fetchWrapper.post(`${this.baseUrl}/balance`, form);
  }

  static async addPerformance(form) {
    return await fetchWrapper.post(`${this.baseUrl}/performance`, form);
  }

  static async destroy(userId) {
    return await fetchWrapper.delete(this.baseUrl, { id: userId });
  }
}
