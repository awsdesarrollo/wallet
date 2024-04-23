import { Api } from '#/utils';

class AuthService {
	static login = async (params = {}) => Api.createResponse('auth/login',params);
	static register = async (params = {}) => Api.createResponse('auth/register',params);
	static recover = async (params = {}) => Api.createResponse('auth/recover',params);
	static checkCode = async (params = {}) => Api.createResponse('auth/check-code',params);
	static reset = async (params = {}) => Api.createResponse('auth/reset',params);
	static getDocumentsType = async (params = {}) => Api.createResponse('auth/get/document-types',params);
	static getVehicleType = async (params = {}) => Api.createResponse('auth/get/vehicles-types',params);
	static getScheduleType = async (params = {}) => Api.createResponse('auth/get/scheduled-types',params);
	static deleteAccount = async (params = {}) => Api.createResponse('auth/delete-account',params);

	static profile = {
		get: async (params = {}) => Api.createResponse('auth/get/profile',params,'get'),
		update: async (params = {}) => Api.createResponse('auth/profile',params),
		password: async (params = {}) => Api.createResponse('auth/profile/password',params),
	}
}

export default AuthService;