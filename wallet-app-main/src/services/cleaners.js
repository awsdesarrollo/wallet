import { Api } from '#/utils';
import { Parse } from '../utils';

class CleanerService {
	static findAll = async (params = {}) => Api.createResponse(`cleaners?${Parse.toQueryString(params)}`,null,'get');
	static findAllForSelect = async () => Api.createResponse('cleaners/for-select',null,'get');
	static update = async (params = {}) => Api.createResponse('cleaners',params,'patch');
	static updateProfile = async (params = {}) => Api.createResponse('cleaners/profile',params,'patch');
	static delete = async (params = {}) => Api.createResponse('cleaners/delete',params);
	static download = async (params = {}) => Api.createResponse(`cleaners/report?${Parse.toQueryString(params)}`,params,'get');
}

export default CleanerService;