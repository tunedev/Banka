import { encrypt, confirm } from '../helpers/encrypt';
import users from '../models/users';
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

  static async userSignin(req, res) {
    const userDetails = await users.getByEmail(req.body.email);

    if (!userDetails) return response.error(res, 401, 'Wrong email and password');

    const {
      id, firstname, lastname, email, password,
    } = userDetails;

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
}

export default UserController;
