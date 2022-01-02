import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import firebase from '../firebase/base';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const tokenExpiryHandler = async (error: any) => {
  if (error.response.data.code !== 'auth/id-token-expired') {
    return Promise.reject(error);
  }

  if (!firebase.auth().currentUser) {
    return Promise.reject(error);
  }

  return firebase
    .auth()
    .currentUser?.getIdToken(true)
    .then((token) => {
      if (token) {
        localStorage.setItem('token', token);
        return Promise.resolve(token);
      }
      localStorage.removeItem('token');
      throw new Error('no token');
    });
};

const refreshAuthLogic = async (failedRequest: any): Promise<any> => {
  const token = await tokenExpiryHandler(failedRequest);
  failedRequest.response.config.headers.authorization = `Bearer ${token}`;
  return Promise.resolve();
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401, 403], // default: [ 401 ]
});

export default api;
