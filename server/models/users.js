import db from '../database';

class Users {
  /**
   *saves new user to users table
   *
   * @static saveUser
   * @param {*} {
   *     firstName, lastName, email, phoneNumber, password, type, isAdmin,
   *   }
   * @returns 1d, firstname, lastname andemail of the newly added user
   * @memberof Users
   */
  static async saveUser({
    firstName,
    lastName,
    email,
    phoneNumber,
    consealedPassword,
    type,
    isAdmin,
  }) {
    const name = ['firstname', 'lastname', 'email', 'phonenumber', 'password', 'type', 'isadmin'];
    const params = [firstName, lastName, email, phoneNumber, consealedPassword, type, isAdmin];

    try {
      const result = await db.query(
        `INSERT INTO users (${name.join(
          ', ',
        )}) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, firstname, lastname, email`,
        params,
      );
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   *Gets the user data from users table that matches the email provided
   *
   * @static getByUser
   * @param {string} email
   * @returns users details
   * @memberof Users
   */
  static async getByEmail(email) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }

  /**
   *Gets the user data from users table that matches the id provided
   *
   * @static getByUser
   * @param {string} email
   * @returns users details
   * @memberof Users
   */
  static async getById(id) {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      return err.code;
    }
  }
}

export default Users;
