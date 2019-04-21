import { encrypt, confirm } from '../helpers/encrypt';
import users from '../models/users';
import accounts from '../models/accounts';
import Auth from '../helpers/auth';
import response from '../helpers/response';

class UserController {
  /**
   * Takes care of client user signup
   *
   * @static userSignup
   * @param {object} req
   * @param {object} res
   * @memberof UserController
   */
  static async userSignup(req, res) {
    const {
      firstName, lastName, email, phoneNumber, password,
    } = req.body;
    const type = 'client';

    const consealedPassword = await encrypt(password, 8);

    // Save new user in database
    const result = await users.saveUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      consealedPassword,
      type,
    });

    if (result === '23505') return response.error(res, 400, 'Email already exist');

    const { id } = result;

    // Generate token for authentication
    const token = await Auth.generateToken({ id });

    return response.success(res, 201, 'You have signed up Successfully', { token, ...result });
  }

  /**
   *Handles user singin endpoint
   *
   * @static userSignin
   * @param {object} req
   * @param {object} res
   * @returns
   * @memberof UserController
   */
  static async userSignin(req, res) {
    const userDetails = await users.getByEmail(req.body.email);

    if (!userDetails) return response.error(res, 401, 'Wrong email and password');

    const {
      id, firstname, lastname, email, password,
    } = userDetails;

    // Confirms inputed password matches the one in record
    const isPasswordMatch = await confirm(req.body.password, password);

    if (!isPasswordMatch) return response.error(res, 401, 'Wrong email and password');

    const token = await Auth.generateToken({ id });

    return response.success(res, 201, 'You have signed in successfully', {
      token,
      ...{
        id,
        firstname,
        lastname,
        email,
      },
    });
  }

  /**
   *Handles users accounts
   *
   * @static getUserAccounts
   * @param {object} req
   * @param {object} res
   * @returns
   * @memberof UserController
   */
  static async getUserAccounts(req, res) {
    const { id } = req.body;

    const result = await accounts.getByOwner(id);

    if (result.length === 0) return response.success(res, 200, 'Successful', 'No accounts created yet for this user');

    return response.success(res, 200, 'Successful', result);
  }
}

export default UserController;
