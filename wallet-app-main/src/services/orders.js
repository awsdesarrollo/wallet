import { Api } from '../utils';

class OrdersService {
  static create = async (params = {}) => Api.createResponse('client/orders',params);
}

export default OrdersService;