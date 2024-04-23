import { Api, Parse } from '#/utils';

class ConfigService {
	static checkUpdates = async (params = {}) => Api.createResponse(`config/check-updates?${Parse.toQueryString(params)}`,{ withoutLoading: true },'get');
}

export default ConfigService;