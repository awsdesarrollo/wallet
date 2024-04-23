import { Api } from '#/utils';
import { Parse } from '../utils';

class StoreService {
	static findAll = async (params = {}) => Api.createResponse(`stores?${Parse.toQueryString(params)}`,null, 'get');
	static findAllForSelect = async () => Api.createResponse('stores/for-select',null,'get');
	static create = async (params = {}) => Api.createResponse('stores',params);
	static update = async (params = {}) => Api.createResponse('stores',params,'patch');
	static delete = async (params = {}) => Api.createResponse('stores/delete',params);
	// static download = async (params = {}) => Api.createResponse(`stores/report?${Parse.toQueryString(params)}`,params,'get');
}

export default StoreService;