import jwt from 'jsonwebtoken';

class Auth {
  /**
   *helps to sign a user with payload
   *
   * @static
   * @param {*} { email, type }
   * @returns
   * @memberof Auth
   */
  static async generateToken({ email, type }) {
    return jwt.sign({ email, type }, process.env.SECRET_KEY, {
      expiresIn: '2h',
    });
  }
}

export default Auth;
