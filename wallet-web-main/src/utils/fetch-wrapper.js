import { AuthService } from '../services';
import { createFormData, getCookie } from '.';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  patch: request('PATCH'),
  put: request('PUT'),
  delete: request('DELETE')
};

function request(method) {
  return async (url, body) => {
    const requestOptions = { method, headers: authHeader() };
    if (body) {
      if (body?.hasFile) {
        requestOptions.body = createFormData(body);

      } else {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify(body);
      }
    }
    return fetch(url, requestOptions).then(handleResponse);
  }
}

function authHeader() {
  const token = getCookie(process.env.REACT_APP_SESSION_NAME);
  return !!token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

async function handleResponse(response) {
  const isJson = response.headers?.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if ([401].includes(response.status)) {
      AuthService.removeSession();
    }

    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }

  return data;
}