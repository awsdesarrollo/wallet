import axios from "axios";
import Config from 'react-native-config';
import { store } from '../store';

let _axios = axios.create({
  baseURL: Config.APP_BASE_API
});

const createFormData = (data) => {
  var formdata = new FormData();
  for (var key in data) {
    if (Array.isArray(data[key])) {
      for (var _key in data[key]) {
        if (Array.isArray(data[key][_key])) {
          for (var i in data[key][_key]) {
            formdata.append(key + '[' + _key + '][' + i + ']', data[key][_key][i]);
          }
        }
        else {
          formdata.append(key + '[' + _key + ']', data[key][_key]);
        }
      }      
    }
    else {
      formdata.append(key, data[key]);
    }    
  }
  return formdata;
}

_axios.interceptors.request.use(
  (config) => {
    const token = store.getState().jwt;
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

_axios.all = axios.all;
_axios.spread = axios.spread;
_axios.upload = (url, data) => {
  return _axios.post(url, createFormData(data), {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
export default _axios;
