// import jwt from 'jsonwebtoken';

/**
 * @desc decodes jwt token and returns payload
 * @param token
 * @returns json payload
 */
const jwtDecoder = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/-/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
};

/**
 * @desc verifies token
 * @param {string} token jwt token
 * @returns {object} object
 */
const checkAuth = (token: string) => {
  if (!token) {
    throw Error('no token found');
  }
  const decoded = jwtDecoder(token);
  if (decoded && (decoded as { exp: number }).exp > Date.now() / 1000) {
    // eslint-disable-next-line camelcase
    return { userId: decoded.user_id };
  }

  throw Error('expired token');
};

export default checkAuth;
