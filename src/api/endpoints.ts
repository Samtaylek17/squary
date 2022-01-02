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

// Property

interface NewProperty {
  title: string;
  description: string;
  price: string;
  owner: string;
  userId: string;
}

export async function newProperty({ title, description, price, owner, userId }: NewProperty) {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties`;
  return api.post(url, { title, description, price, owner, userId });
}

export async function getMyProperties() {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties`;
  return api.get(url);
}

// export async function transferProperty()
