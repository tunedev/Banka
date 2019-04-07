import users from '../models/user';
import helper from '../helpers/account';

class AccountController {
  static postAccount(req, res) {
    const { id, type } = req.body;

    const userDetails = users.find(user => user.id === id);

    const { email, firstName, lastName } = userDetails;

    const accountNumber = helper.generateAccountNumber();

    helper.saveAccount({ accountNumber, id, type });

    return res.status(201).json({
      status: 201,
      data: {
        accountNumber,
        firstName,
        lastName,
        email,
        type,
      },
    });
  }
}

export default AccountController;
