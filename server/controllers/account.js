import users from '../models/users';
import helper from '../helpers/account';
import accounts from '../models/accounts';
import transactions from '../models/transactions';

class AccountController {
  /**
   *handles the request to add a new account
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @returns new account details as a response
   * @memberof AccountController
   */
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

  /**
   *handles the request to add toggle accounts status
   *
   * @static patchAccount
   * @param {object} req
   * @param {object} res
   * @returns account number and accounts new status as a response
   * @memberof AccountController
   */
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

  /**
   *handles request to api/v1/accounts/:accountNumber
   *
   * @static static deleteAccount
   * @param {object} req
   * @param {object} res
   * @returns respose for successful request
   * @memberof AccountController
   */
  static deleteAccount(req, res) {
    const reqAccountNumber = parseInt(req.params.accountNumber, 10);

    helper.deleteAccount(reqAccountNumber);

    return res.status(200).json({
      status: 200,
      message: 'Account successfully deleted',
    });
  }

  /**
   *helps handle debit transaction and saves the transaction details in record
   *
   * @static postDebit
   * @param {object} req
   * @param {object} res
   * @returns response with transaction details
   * @memberof AccountController
   */
  static postDebit(req, res) {
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const { amount, id } = req.body;

    const transactionType = 'debit';

    const { newBalance, oldBalance } = helper.debitAccount(accountNumber, amount);

    helper.saveTransaction({
      accountNumber,
      amount,
      transactionType,
      cashierId: id,
      oldBalance,
      newBalance,
    });

    return res.status(201).json({
      status: 201,
      data: {
        transactionId: transactions.length,
        accountNumber,
        amount,
        cashier: id,
        transactionType,
        balance: newBalance,
      },
    });
  }

  /**
   *helps handle credit transaction and saves the transaction details in record
   *
   * @static postCredit
   * @param {object} req
   * @param {object} res
   * @returns response with transaction details
   * @memberof AccountController
   */
  static postCredit(req, res) {
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const { amount, id } = req.body;

    const transactionType = 'credit';

    const { newBalance, oldBalance } = helper.creditAccount(accountNumber, amount);

    helper.saveTransaction({
      accountNumber,
      amount,
      transactionType,
      cashierId: id,
      oldBalance,
      newBalance,
    });

    return res.status(201).json({
      status: 201,
      data: {
        transactionId: transactions.length,
        accountNumber,
        amount,
        cashier: id,
        transactionType,
        balance: newBalance,
      },
    });
  }
}

export default AccountController;
