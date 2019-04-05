import User from '../models/user.model';
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
        id: User.length,
        firstName,
        lastName,
        email,
      },
    });
  }
}

export default UserController;
