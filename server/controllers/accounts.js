import users from '../models/user';
import helper from '../helpers/account';
import accounts from '../models/accounts';

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

  static patchAccount(req, res) {
    const reqAccountNumber = parseInt(req.params.accountNumber, 10);

    helper.toggleAccountStatus(reqAccountNumber);

    const accountDetails = accounts.find(account => account.accountNumber === reqAccountNumber);

    const { status, accountNumber } = accountDetails;

    return res.status(200).json({
      status: 200,
      data: {
        accountNumber,
        status,
      },
    });
  }
}

export default AccountController;
