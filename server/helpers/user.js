import bcrypt from 'bcryptjs';

import User from '../models/users';

class UserHelp {
  /**
   *helps hash user password
   *
   * @static hashPassword
   @param {String} password
   * @memberof UserHelp
   */
  static hashPassword(password) {
    return bcrypt.hash(password, 8);
  }

  /**
   *adds new user to the Users record
   *
   * @static saveUser
   * @param {object} {
   *     password,
   *     email,
   *     firstName,
   *     lastName,
   *     phoneNumber,
   *     token
   *   }
   * @memberof UserHelp
   */
  static saveUser({
    password, email, firstName, lastName, phoneNumber, type, token,
  }) {
    const newUser = {
      id: User.length + 1,
      email,
      firstName,
      lastName,
      phoneNumber,
      password,
      type,
      isAdmin: false,
    };

    newUser.tokens = [{ id: 1, token }];

    User.push(newUser);
  }
}

export default UserHelp;
