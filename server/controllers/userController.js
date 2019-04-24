import { encrypt, confirm } from '../helpers/encrypt';
import users from '../models/users';
import accounts from '../models/accounts';
import Auth from '../helpers/auth';
import responseHandler from '../helpers/response';

const { error, success } = responseHandler;

class UserController {
  /**
   * Takes care of client user signup
   *
   * @static userSignup
   * @param {object} request
   * @param {object} response
   * @memberof UserController
   */
  static async userSignup(request, response) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      type,
      isAdmin
    } = request.body;

    const consealedPassword = await encrypt(password, 8);

    const result = await users.saveUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      consealedPassword,
      type,
      isAdmin
    });

    const { id } = result;
    const authData = await users.getAuthData(id);
    const token = await Auth.generateToken(authData);

    return success(response, 201, 'You have signed up Successfully', {
      token,
      ...result
    });
  }

  /**
   * Handles user singin endpoint
   *
   * @static userSignin
   * @param {object} request
   * @param {object} response
   * @returns
   * @memberof UserController
   */
  static async userSignin(request, response) {
    const userDetails = await users.getByEmail(request.body.email);
    if (!userDetails) return error(response, 401, 'Wrong email or password');

    const {
      id, firstname, lastname, email, password
    } = userDetails;

    const isPasswordMatch = await confirm(request.body.password, password);

    if (!isPasswordMatch) {
      return error(response, 401, 'Wrong email or password');
    }

    const authData = await users.getAuthData(id);
    const token = await Auth.generateToken(authData);

    return success(response, 201, 'You have signed in successfully', {
      token,
      ...{
        id,
        firstname,
        lastname,
        email
      }
    });
  }

  /**
   * Handles users accounts
   *
   * @static getUserAccounts
   * @param {object} request
   * @param {object} response
   * @returns
   * @memberof UserController
   */
  static async getUserAccounts(request, response) {
    const { id } = request.body;

    const result = await accounts.getByOwner(id);

    if (result.length === 0) {
      return success(
        response,
        200,
        'Successful',
        'No accounts created yet for this user'
      );
    }
    return success(response, 200, 'Successful', result);
  }
}

export default UserController;
