import helper from '../../helpers/validation';
import accounts from '../../models/accounts';
import response from '../../helpers/response';

class AccountValidation {
  /**
   *validates that the post request are all comforming to the criteria
   *
   * @static postAccount
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns error messages specific to the post account endpoint
   * @memberof ValidateAccount
   */
  static postAccount(req, res, next) {
    const { id, type } = req.body;

    const requiredNotGiven = helper.requiredFieldIsGiven({ id, type });

    if (requiredNotGiven) {
      return response.error(res, 400, requiredNotGiven);
    }

    const isNotString = helper.stringType({ type });
    if (isNotString) {
      return response.error(res, 400, isNotString);
    }

    if (type.toLowerCase() !== 'savings' && type.toLowerCase() !== 'current') {
      return response.error(res, 400, 'Account type can either be "savings" or "current"');
    }
    next();
  }

  /**
   *validates that the patch request that it contains an existing account number
   *
   * @static patchAccount
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns error 404 if specified account number does not exist
   * @memberof ValidateAccount
   */
  static async accountNumber(req, res, next) {
    const accountNumber = parseInt(req.params.accountNumber, 10);

    const accountDetails = await accounts.findByAccountNumber(accountNumber);

    if (!accountDetails || accountDetails === '22P02') {
      return response.error(res, 404, 'Specified account number does not exist yet');
    }

    req.body.accountNumber = accountNumber;
    req.body.oldBalance = accountDetails.balance;
    next();
  }

  /**
   *validates that the account to debit has sufficient funds
   *
   * @static confirmSufficientBalance
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns error response for insufficient funds
   * @memberof ValidateAccount
   */
  static async confirmSufficientBalance(req, res, next) {
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const { amount } = req.body;

    const accountDetails = await accounts.findByAccountNumber(accountNumber);
    const { balance } = accountDetails;

    if (balance < amount) return response.error(res, 400, 'Account balance is not sufficient');

    next();
  }

  /**
   *validates that required inputs are given
   *
   * @static transaction
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns response indicating input field not given
   * @memberof ValidateAccount
   */
  static transaction(req, res, next) {
    const { amount, id } = req.body;

    const requiredNotGiven = helper.requiredFieldIsGiven({ id, amount });

    if (requiredNotGiven) {
      return response.error(res, 400, requiredNotGiven);
    }

    next();
  }
}

export default AccountValidation;
