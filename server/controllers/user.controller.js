import Users from '../models/user.model';
import Help from '../helper-functions/user.help';

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

    const token = await Help.generateToken({ email, type });

    const consealedPassword = await Help.hashPassword(password);

    Help.saveUser({
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

    const token = await Help.generateToken({ email, role: 'client' });

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
