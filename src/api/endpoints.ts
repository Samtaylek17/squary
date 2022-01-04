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

export interface NewProperty {
  title: string;
  description: string;
  price: string;
}

export async function createProperty({ title, description, price }: NewProperty) {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties`;
  return api.post(url, { title, description, price });
}

export async function getMyProperties() {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties`;
  return api.get(url);
}

export async function transferProperty(propertyId: string, recipientEmail: string) {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties/transfer/${propertyId}`;
  return api.put(url, { recipientEmail });
}

export async function getOneProperty(propertyId: string) {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties/${propertyId}`;
  return api.get(url);
}

export async function updateProperty(propertyId: string, updatedProperty: Partial<NewProperty>) {
  const url = `${process.env.REACT_APP_PROPERTY_API_URL}/properties/${propertyId}`;
  return api.put(url, updatedProperty);
}
