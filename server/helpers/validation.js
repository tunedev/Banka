import validate from 'validate.js';
import validator from 'validator';

const generateIncorrectTypeErrMsg = (
  field,
  type
) => `Expect ${field} to be a valid ${type} type, 
  please ammend as appropriate`;

class Validation {
  /**
   * Helps handle required input field
   *
   * @static requiredFieldIsGiven
   * @param {object} input - the user inputed values to be checked
   * @returns message of the field required for the
   first field not provided, and null otherwise
   * @memberof ValidateUser
   */
  static requiredFieldIsGiven(input) {
    const generateNotGivenErrMsg = field => `${field} required, please provide`;

    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => validate.isEmpty(valuePairs[1]));

    return wrongInput ? generateNotGivenErrMsg(wrongInput[0]) : null;
  }

  /**
   * Validates fields that are required to be type string
   *
   * @static validateStringtype
   * @param {object} input - the user inputed values to be checked
   * @returns error message indicating the first input that is not a
    string, and null if non is found
   * @memberof Validate
   */
  static stringType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(
      valuePairs => typeof valuePairs[1] !== 'string'
    );

    return wrongInput
      ? generateIncorrectTypeErrMsg(wrongInput[0], 'string')
      : null;
  }

  /**
   * Validates fields that are required to be type string
   *
   * @static validateStringtype
   * @param {object} input - the user inputed values to be checked
   * @returns error message indicating the first input that is not a
    string, and null if non is found
   * @memberof Validate
   */
  static textType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(
      valuePairs => !validator.isAlpha(valuePairs[1])
    );

    return wrongInput
      ? generateIncorrectTypeErrMsg(wrongInput[0], 'text')
      : null;
  }

  /**
   * Validates that required input is a number type
   *
   * @static validateNumberType
   * @param {object} input - the user inputed values to be checked
   * @returns error message indicating the first
   input that is not an integer,and null otherwise
   * @memberof Validate
   */
  static numberType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(
      valuePairs => !validator.isNumeric(valuePairs[1])
    );

    return wrongInput
      ? generateIncorrectTypeErrMsg(wrongInput[0], 'number')
      : null;
  }

  /**
   * Validates that an email input is valid email
   *
   * @static
   * @param {object} input - the user inputed values to be checked
   * @returns error message indicating the email input is invalid
   * @memberof Validate
   */
  static emailType(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(
      valuePairs => !validator.isEmail(valuePairs[1])
    );

    return wrongInput
      ? generateIncorrectTypeErrMsg(wrongInput[0], 'email')
      : null;
  }

  /**
   * Helps check if input is a valid phone number format
   *
   * @static PhoneNumberValid
   * @param {object} input
   * @returns null if in put is a
   correct phone number format, and an error message otherwise
   * @memberof Validate
   */
  static phoneNumberValid(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(
      valuePairs => !validator.isMobilePhone(valuePairs[1])
    );

    return wrongInput
      ? `${generateIncorrectTypeErrMsg(wrongInput[0], 'phone Number')}`
      : null;
  }

  /**
   * Helps check if input's length is greater or equal to 6
   *
   * @static minPasswordLength
   * @param {object} input
   * @returns null if input's length is 6
   and above, and returns an error message otherwise
   * @memberof Validate
   */
  static minPasswordLength(input) {
    const inputPairs = Object.entries(input);

    const wrongInput = inputPairs.find(valuePairs => valuePairs[1].length <= 6);

    return wrongInput
      ? `${wrongInput[0]}'s length should be 6 or above `
      : null;
  }
}

export default Validation;
