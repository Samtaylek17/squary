import jwt from 'jsonwebtoken';

/**
 * @desc verifies token
 * @param {string} token jwt token
 * @returns {object} object
 */
const checkAuth = (token: string): object => {
  if (!token) {
    throw Error('no token found');
  }
  const decoded = jwt.decode(token);
  if (decoded && (decoded as { exp: number }).exp > Date.now() / 1000) {
    return { userId: (decoded as { user_id: string }).user_id };
  }

  throw Error('expired token');
};

export default checkAuth;
