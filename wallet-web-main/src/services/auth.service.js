import { deleteCookie, fetchWrapper, setCookie } from '../utils';

const baseUrl = process.env.REACT_APP_BASE_API + 'auth';

export async function login(form) {
  const url = `${baseUrl}/login/web`;
  const session = await fetchWrapper.post(url, form);
  setCookie(process.env.REACT_APP_SESSION_NAME, session?.user?.token || '', form?.remember ? 7 : 1);
  return session;
}

export async function recover(form) {
  const url = `${baseUrl}/recover`;
  return await fetchWrapper.post(url, form);
}

export async function resetPassword(form) {
  const url = `${baseUrl}/reset`;
  return await fetchWrapper.post(url, form);
}

export async function logout() {
  removeSession();
}

export function removeSession() {
  deleteCookie(process.env.REACT_APP_SESSION_NAME);
  window.location.replace(`${process.env.REACT_APP_BASENAME}/`);
}

export async function getProfile() {
  return await fetchWrapper.get(`${baseUrl}/get/profile`);
}