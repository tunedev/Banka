import users from '../models/users';
import accounts from '../models/accounts';
import transactions from '../models/transactions';
import responseHandler from '../helpers/response';
import emailNotification from '../helpers/emailNotifications';

const { error, success } = responseHandler;

class AccountController {
  /**
   * Handles the request to add a new account
   *
   * @static
   * @param {object} request
   * @param {object} response
   * @returns new account details as a response
   * @memberof AccountController
   */
  static async postAccounts(request, response) {
    const { id, type } = request.body;
    const userDetails = await users.getById(id);

    if (!userDetails) {
      return error(response, 404, 'user id specified does not exist');
    }

    const { email, firstname, lastname } = userDetails;

    const result = await accounts.save({ id, type });
    const { accountnumber } = result;

    return success(response, 201, 'Account created successful', {
      accountNumber: accountnumber,
      firstName: firstname,
      lastName: lastname,
      email,
      type
    });
  }

  /**
   * Handles the request to add toggle accounts status
   *
   * @static patchAccount
   * @param {object} request
   * @param {object} response
   * @returns account number and accounts new status as a response
   * @memberof AccountController
   */
  static async patchAccount(request, response) {
    const { accountNumber, status } = request.body;

    const result = await accounts.toggleStatus(accountNumber, status);

    return success(response, 200, 'Account status was changed successfully', {
      ...result
    });
  }

  /**
   * Handles request to delete an account
   *
   * @static static deleteAccount
   * @param {object} request
   * @param {object} response
   * @returns respose for successful request
   * @memberof AccountController
   */
  static async deleteAccount(request, response) {
    const { accountNumber } = request.body;

    const result = await accounts.delete(accountNumber);

    return success(response, 200, 'Account successfully deleted', {
      ...result
    });
  }

  /**
   * Helps handle debit transaction and saves the transaction details in record
   *
   * @static postDebit
   * @param {object} request
   * @param {object} response
   * @returns response with transaction details
   * @memberof AccountController
   */
  static async postDebit(request, response) {
    const {
      amount,
      id,
      oldBalance,
      accountNumber,
      remarks,
      accountOwner
    } = request.body;

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
      remarks
    });

    const transactionId = result.id;

    emailNotification.transactionAlert(result, accountOwner);

    return success(response, 201, 'Account has been debited successfully', {
      transactionId,
      accountNumber,
      amount,
      cashier: id,
      transactionType: result.type,
      balance: newBalance
    });
  }

  /**
   * Helps handle credit transaction and saves the transaction details in record
   *
   * @static postCredit
   * @param {object} request
   * @param {object} response
   * @returns response with transaction details
   * @memberof AccountController
   */
  static async postCredit(request, response) {
    const {
      amount,
      id,
      accountNumber,
      oldBalance,
      remarks,
      accountOwner
    } = request.body;

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
      remarks
    });

    emailNotification.transactionAlert(result, accountOwner);

    return success(response, 201, 'Account has been credited successfully', {
      transactionId: result.id,
      accountNumber,
      amount,
      cashier: id,
      transactionType: result.type,
      balance: newBalance,
      remarks
    });
  }

  /**
   * Handles Get request for all transaction done on an account
   *
   * @static getAllTransactions
   * @param {object} request
   * @param {object} response
   * @returns an array of accounts transaction as a response with a message
   * @memberof AccountController
   */
  static async getAllTransactions(request, response) {
    const { accountNumber } = request.body;

    const result = await transactions.getByAccountNumber(accountNumber);

    return success(
      response,
      200,
      'Transactions have been gotten successfully',
      result
    );
  }

  /**
   * Handles get request for a specific transaction on an account
   *
   * @static getSpecificTransaction
   * @param {object} request
   * @param {object} response
   * @returns the transaction with the specified id
   * @memberof AccountController
   */
  static async getSpecificTransaction(request, response) {
    const { accountNumber, id } = request.body;

    const result = await transactions.getByAccountNumberAndId(
      accountNumber,
      id
    );

    if (!result) {
      return error(
        response,
        404,
        'Transaction with specified id does not exist'
      );
    }

    return success(response, 200, 'Transaction gotten successfully', result);
  }

  /**
   * Handles get specific account endpoint
   *
   * @static getSpecificAccount
   * @param {object} request
   * @param {object} response
   * @returns
   * @memberof AccountController
   */
  static async getSpecificAccount(request, response) {
    const { accountNumber } = request.body;

    const result = await accounts.findByAccountNumber(accountNumber);

    return success(response, 200, 'Successful', result);
  }

  /**
   * Handles request made to get all acounts endpoint
   *
   * @static getAllAccount
   * @param {object} request
   * @param {object} response
   * @memberof AccountController
   */
  static async getAllAccounts(request, response) {
    const { status } = request.query;

    let result;
    if (status === 'active' || status === 'dormant') {
      result = await accounts.getByStatus(status);
    } else {
      result = await accounts.getAll();
    }
    return success(response, 200, 'successful', result);
  }
}

export default AccountController;
