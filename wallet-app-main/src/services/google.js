import Config from 'react-native-config';
import { Api } from '../utils';

class GoogleService {
	
    static calculateTimeRouting = async (params = {}) => Api.createResponse('google/calculateTimeRouting',params);
    static getAddress = async (params = {}) => await Api.createResponse('google/getAddress', params);
    static autocomplete = async (params = {}) => await Api.createResponse('google/autocomplete', params);
    static geoCode = async (params = {}) => Api.createResponse('google/geoCode',params);
    static getAddresByLatlng = async (params = {}) => Api.createResponse('google/getAddresByLatlng', params);
}

export default GoogleService;