import Users from '../models/user';
import Auth from '../helpers/auth';
import helper from '../helpers/user';

class UserController {
  /**
   *takes care of client user signup
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

    const token = await Auth.generateToken({ email, type });

    const consealedPassword = await helper.hashPassword(password);

    helper.saveUser({
      consealedPassword,
      email,
      firstName,
      lastName,
      phoneNumber,
      type,
      token,
    });

    return res.status(201).json({
      status: 201,
      data: {
        token,
        id: Users.length,
        firstName,
        lastName,
        email,
      },
    });
  }

  static async userSignin(req, res) {
    const userDetails = Users.find(user => user.email === req.body.email);

    const {
      email, firstName, lastName, id,
    } = userDetails;

    const token = await Auth.generateToken({ email, role: 'client' });

    return res.status(201).json({
      status: 201,
      data: {
        token,
        id,
        firstName,
        lastName,
        email,
      },
    });
  }
}

export default UserController;
