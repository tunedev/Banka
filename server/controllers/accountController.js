import users from '../models/users';
import accounts from '../models/accounts';
import transactions from '../models/transactions';
import response from '../helpers/response';

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
  static async postAccount(req, res) {
    const { id, type } = req.body;

    const userDetails = await users.getById(id);

    if (!userDetails) return response.error(res, 404, 'user id specified does not exist');

    const { email, firstname, lastname } = userDetails;

    const result = await accounts.save({ id, type });

    const { accountnumber } = result;

    return response.success(res, 201, 'Account created successful', {
      accountNumber: accountnumber,
      firstName: firstname,
      lastName: lastname,
      email,
      type,
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
  static async patchAccount(req, res) {
    const { accountNumber } = req.body;

    const result = await accounts.toggleStatus(accountNumber);

    return response.success(res, 200, 'Status toggled successfully', { ...result });
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
  static async deleteAccount(req, res) {
    const { accountNumber } = req.body;

    const result = await accounts.delete(accountNumber);

    return response.success(res, 200, 'Account successfully deleted', { ...result });
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
  static async postDebit(req, res) {
    const {
      amount, id, oldBalance, accountNumber,
    } = req.body;

    const transactionType = 'debit';

    const debitAccount = await accounts.debit(accountNumber, amount);

    const newBalance = debitAccount.balance;

    const result = await transactions.save({
      transactionType,
      accountNumber,
      cashierId: id,
      amount,
      oldBalance,
      newBalance,
    });

    if (result === '23503') return response.error(res, 400, 'cashier id does not match any in our record');

    return response.success(res, 201, 'Account has been debited successfully', {
      transactionId: result.id,
      accountNumber,
      amount,
      cashier: id,
      transactionType: result.type,
      balance: newBalance,
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
  static async postCredit(req, res) {
    const {
      amount, id, accountNumber, oldBalance,
    } = req.body;

    const transactionType = 'credit';

    const creditAccount = await accounts.credit(accountNumber, amount);

    const newBalance = creditAccount.balance;
    const result = await transactions.save({
      transactionType,
      accountNumber,
      cashierId: id,
      amount,
      oldBalance,
      newBalance,
    });

    if (result === '23503') return response.error(res, 400, 'cashier id does not match any in our record');

    return response.success(res, 201, 'Account has been credited successfully', {
      transactionId: result.id,
      accountNumber,
      amount,
      cashier: id,
      transactionType: result.type,
      balance: newBalance,
    });
  }
}

export default AccountController;
