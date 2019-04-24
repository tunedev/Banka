import jwt from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

class Auth {
  /**
   * Helps to sign a user with payload
   *
   * @static
   * @param {object} payload - consists of user email, id, and user type
   * @returns
   * @memberof Auth
   */
  static async generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY);
  }

  /**
   * Helps decode token for authentication
   *
   * @static decodeToken
   * @param {encodedString} token - encoded token
   * @returns
   * @memberof Auth
   */
  static async decodeToken(token) {
    try {
      const decoded = await jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (err) {
      throw Error(err);
    }
  }
}

export default Auth;
