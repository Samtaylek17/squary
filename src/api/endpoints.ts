import api from './api';

// Auth

export async function loginUser({ email, password }: { email: string; password: string }) {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/login`;
  return api.post(url, { email, password });
}

export async function getUser() {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/user`;
  return api.get(url);
}
