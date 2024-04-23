import { Api } from '#/utils';

const USER_REPORTS = 'admin/user/reports/';

class ClientsService {
	
	static get = async (params = {}) => Api.createResponse('admin/clients/get',params);
	static delete = async (params = {}) => Api.createResponse('admin/clients/delete',params);
	static createClient = async (params = {}) => Api.createResponse('admin/clients/createClient',params);
	static createDriver = async (params = {}) => Api.createResponse('admin/clients/createDriver',params);
	static updateDriver = async (params = {}) => Api.createResponse('admin/clients/updateDriver',params);
	static sendCredentials = async (params = {}) => Api.createResponse('admin/clients/sendCredentials',params);

	static reports = {
		getUserReports: async (params = {}) => Api.createResponse(`${USER_REPORTS}get-report`,params)
	}
}

export default ClientsService;