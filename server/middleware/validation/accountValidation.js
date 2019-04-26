import helper from '../../helpers/validation';
import accounts from '../../models/accounts';
import responseHandler from '../../helpers/response';

const { error } = responseHandler;
const {
  requiredFieldIsGiven, stringType, textType, numberType
} = helper;

class AccountValidation {
  /**
   * Validates that the post request are all comforming to the criteria
   *
   * @static postAccount
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns error messages specific to the post account endpoint
   * @memberof ValidateAccount
   */
  static postAccount(request, response, next) {
    const { id, type } = request.body;

    const requiredNotGiven = requiredFieldIsGiven({ id, type });

    if (requiredNotGiven) {
      return error(response, 400, requiredNotGiven);
    }

    const isNotString = stringType({ type });
    if (isNotString) {
      return error(response, 400, isNotString);
    }

    if (type.toLowerCase() !== 'savings' && type.toLowerCase() !== 'current') {
      return error(
        response,
        400,
        'Account type can either be "savings" or "current"'
      );
    }
    next();
  }

  /**
   * Validates that the patch request that
   it contains an existing account number
   *
   * @static patchAccount
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns error 404 if specified account number does not exist
   * @memberof ValidateAccount
   */
  static async accountNumber(request, response, next) {
    const { accountNumber } = request.params;
    const isNotNumberType = numberType({
      accountNumber
    });
    if (isNotNumberType) {
      return error(response, 400, 'Account number should be a number');
    }

    if (accountNumber.length > 10) {
      return error(response, 400, 'Account Number can not excede 10 digits');
    }

    const accountnumber = parseInt(accountNumber, 10);
    const accountDetails = await accounts.findByAccountNumber(accountnumber);

    if (!accountDetails) {
      return error(
        response,
        404,
        'Specified account number does not exist yet'
      );
    }

    request.body.accountNumber = accountnumber;
    request.body.oldBalance = accountDetails.balance;
    next();
  }

  /**
   * Validates that the account to debit has sufficient funds
   *
   * @static confirmSufficientBalance
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns error response for insufficient funds
   * @memberof ValidateAccount
   */
  static async confirmSufficientBalance(request, response, next) {
    const accountNumber = parseInt(request.params.accountNumber, 10);
    const { amount } = request.body;

    const accountDetails = await accounts.findByAccountNumber(accountNumber);
    const { balance } = accountDetails;

    if (balance < amount) {
      return error(response, 400, 'Account balance is not sufficient');
    }

    next();
  }

  /**
   * Validates that required inputs are given
   and that amount is a positive number
   *
   * @static transaction
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns response indicating input field not given
   * @memberof ValidateAccount
   */
  static transaction(request, response, next) {
    const { amount, id } = request.body;

    const requiredNotGiven = requiredFieldIsGiven({ id, amount });

    if (requiredNotGiven) {
      return error(response, 400, requiredNotGiven);
    }

    const isNotNumberType = numberType(amount);
    if (isNotNumberType) {
      return error(response, 400, isNotNumberType);
    }

    if (amount < 0) {
      return error(response, 400, 'Amount should not be a negative value');
    }

    next();
  }

  /**
   * Validates input request query parameter
   *
   * @static
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns
   * @memberof AccountValidation
   */
  static getAccounts(request, response, next) {
    const { status } = request.query;

    if (status) {
      const isNotText = textType({ status });
      if (isNotText) {
        return error(response, 400, 'Status value expected string');
      }

      const statusLowCased = status.toLowerCase();
      request.query.status = statusLowCased;

      if (statusLowCased !== 'dormant' && statusLowCased !== 'active') {
        return error(
          response,
          400,
          "Status query's value should either be active or dormant"
        );
      }
    }
    next();
  }

  /**
   * Validates that the input status is given
   and it is either active or dormant
   *
   * @static validateStatusToggle
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns
   * @memberof AccountValidation
   */
  static validateStatusToggle(request, response, next) {
    const { status } = request.body;

    const requiredNotGiven = requiredFieldIsGiven({ status });

    if (requiredNotGiven) {
      return error(response, 400, requiredNotGiven);
    }

    if (status) {
      const isNotText = textType({ status });
      if (isNotText) {
        return error(response, 400, 'Status value expected string');
      }

      const statusLowCased = status.toLowerCase();
      request.query.status = statusLowCased;

      if (statusLowCased !== 'dormant' && statusLowCased !== 'active') {
        return error(
          response,
          400,
          "Status query's value should either be active or dormant"
        );
      }
    }
    next();
  }

  static idNumberType(request, response, next) {
    const { id } = request.params;

    const isNotNumberType = numberType({ id });
    if (isNotNumberType) {
      return error(response, 400, isNotNumberType);
    }

    const transactionId = parseInt(id, 10);
    request.body.id = transactionId;
    next();
  }
}

export default AccountValidation;
