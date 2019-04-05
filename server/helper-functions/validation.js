import validate from 'validate.js';
import validator from 'validator';

import Users from '../models/user.model';

const generateIncorrectTypeErrMsg = (field, type) => `${field} should be a valid ${type} type, please ammend as appropriate`;

class Validate {
  /**
   *helps affirm if new user's email has not being used
   *
   * @static ensureUniqueEmail
   * @param {string} email
   * @returns true if user email is unique and false otherwise
   * @memberof AuthenticateUser
   */
  static emailIsUnique(email) {
    return !Users.find(user => user.email === email);
  }

  /**
   *helps handle required input field
   *
   * @static
   * @param {object} input
   * @returns message of the field required for the first field not provided
   * @memberof ValidateUser
   */
  static requiredfieldIsGiven(input) {
    const generateNotGivenErrMsg = field => `${field} required, please provide`;

    const inputPairs = Object.entries(input);

    console.log(inputPairs.find(valuePairs => validate.isEmpty(valuePairs[1])));

    const wrongInput = inputPairs.find(valuePairs => validate.isEmpty(valuePairs[1]));

    return wrongInput ? generateNotGivenErrMsg(wrongInput[0]) : null;
  }

  /**
   *validates fields that are required to be type string
   *
   * @static validateStringtype
   * @param {object} input
   * @returns error message indicating the first input that is not a string
   * @memberof Validate
   */
  static stringType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => typeof valuePairs[1] !== 'string');

    return wrongInput ? generateIncorrectTypeErrMsg(wrongInput[0], 'string') : null;
  }

  /**
   *validates that required input is a number type
   *
   * @static validateNumberType
   * @param {object} input
   * @returns error message indicating the first input that is not a number
   * @memberof Validate
   */
  static numberType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => validator.isNumeric(valuePairs[1]));

    return wrongInput ? generateIncorrectTypeErrMsg(wrongInput[0], 'number') : null;
  }

  /**
   *Validates that an email input is valid email
   *
   * @static
   * @param {object} input
   * @returns error message indicating the email input is invalid
   * @memberof Validate
   */
  static emailType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => !validator.isEmail(valuePairs[1]));

    return wrongInput ? generateIncorrectTypeErrMsg(wrongInput[0], 'email') : null;
  }

  static phoneNumberValid(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => validator.isMobilePhone(
      valuePairs[1],
      [...validator.isMobilePhoneLocales],
      [{ strictMode: true }],
    ));

    return wrongInput
      ? `${generateIncorrectTypeErrMsg(wrongInput[0], 'phone Number')}add the country code`
      : null;
  }

  static minPasswordLength(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => valuePairs[1].lengthc <= 6);

    return wrongInput ? `${wrongInput[0]}'s length should be 6 or above ` : null;
  }
}

export default Validate;
