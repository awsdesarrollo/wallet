import { Api } from '../utils';

const ROUTE = 'driver/route/';
const REPORT = 'admin/report-orders/';
const DRIVER = 'driver/orders/';
const CLIENT = 'client/orders/';

class RouteService {

    static searchDrivers = async (params = {}) => Api.createResponse(`${ROUTE}searchDrivers`, params);
    static setStatusDriver = async (params = {}) => Api.createResponse(`${DRIVER}set-status`, params);
	
    static route = {
        newRoute: async (params = {}) => Api.createResponse(`${ROUTE}newRoute`,params),
        get: async (params = {}) => Api.createResponse(`${ROUTE}get`,params)
    }
    static orderReport = {
        get: async (params = {}) => Api.createResponse(`${REPORT}get`,params),
        excelReport: async (params = {}) => Api.createResponse(`${REPORT}export`,params)
    }
    static driverReport = {
        get: async (params = {}) => Api.createResponse(`${DRIVER}get`,params),
        excelReport: async (params = {}) => Api.createResponse(`${DRIVER}export`,params)
    }
    static clientReport = {
        get: async (params = {}) => Api.createResponse(`${CLIENT}get`,params),
        excelReport: async (params = {}) => Api.createResponse(`${CLIENT}export`,params)
    }
}

export default RouteService;