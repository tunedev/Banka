import helper from '../../helpers/validation';
import accounts from '../../models/accounts';

class AccountValidation {
  /**
   *validates the post request are all comformint to the criteria
   *
   * @static
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
      return res.status(400).json({
        status: 400,
        error: requiredNotGiven,
      });
    }

    const isUserIdInRecord = accounts.find(account => account.id === id);

    if (!isUserIdInRecord) {
      return res.status(404).json({
        status: 404,
        error: `user with id: ${id} does not exist in our record`,
      });
    }

    const isNotString = helper.stringType({ type });
    if (isNotString) {
      return res.status(400).json({
        status: 400,
        error: isNotString,
      });
    }

    if (type.toLowerCase() !== 'savings' && type.toLowerCase() !== 'current') {
      return res.status(400).json({
        status: 400,
        error: 'Account type must either be savings or current',
      });
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
  static accountNumber(req, res, next) {
    const reqAccountNumber = parseInt(req.params.accountNumber, 10);

    const accountDetails = accounts.find(account => account.accountNumber === reqAccountNumber);

    if (!accountDetails) {
      return res.status(404).json({
        status: 404,
        error: 'specified account does not exist',
      });
    }
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
  static confirmSufficientBalance(req, res, next) {
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const { amount } = req.body;

    if (!helper.isBalanceSufficient(accountNumber, amount)) {
      return res.status(400).json({
        status: 400,
        error: 'insufficient funds',
      });
    }

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
      return res.status(400).json({
        status: 400,
        error: requiredNotGiven,
      });
    }

    next();
  }
}

export default AccountValidation;
