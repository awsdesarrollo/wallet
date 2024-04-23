import { Api } from '#/utils';

class FirebaseService {

	static create = async (params = {}) => Api.createResponse('firebase/create',params);
	static delete = async (params = {}) => Api.createResponse('firebase/delete',params);

}

export default FirebaseService;