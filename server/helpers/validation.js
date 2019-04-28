import validate from 'validate.js';
import validator from 'validator';

const generateIncorrectTypeErrMsg = (field, type) => `Expect ${field} to be a valid ${type} type`;

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
  static requiredFieldIsGiven(input, errors) {
    const generateNotGivenErrMsg = field => `${field} required, please provide`;

    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => validate.isEmpty(valuePairs[1]))
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${generateNotGivenErrMsg(values[0])}`;
        } else {
          errors[values[0]] = generateNotGivenErrMsg(values[0]);
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
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
  static stringType(input, errors) {
    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => !validate.isEmpty(valuePairs[1]))
      .filter(valuePairs => typeof valuePairs[1] !== 'string')
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${generateIncorrectTypeErrMsg(
            values[0],
            'string'
          )}`;
        } else {
          errors[values[0]] = generateIncorrectTypeErrMsg(values[0], 'string');
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
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
  static textType(input, errors) {
    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => !validate.isEmpty(valuePairs[1]))
      .filter(valuePairs => !validator.isAlpha(valuePairs[1]))
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${generateIncorrectTypeErrMsg(
            values[0],
            'text'
          )}`;
        } else {
          errors[values[0]] = generateIncorrectTypeErrMsg(values[0], 'text');
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
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
  static numberType(input, errors) {
    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => !validate.isEmpty(valuePairs[1]))
      .filter(valuePairs => !validator.isNumeric(valuePairs[1]))
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${generateIncorrectTypeErrMsg(
            values[0],
            'number'
          )}`;
        } else {
          errors[values[0]] = generateIncorrectTypeErrMsg(values[0], 'number');
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
  }

  /**
   * Validates that an email input is valid email
   *
   * @static
   * @param {object} input - the user inputed values to be checked
   * @returns error message indicating the email input is invalid
   * @memberof Validate
   */
  static emailType(input, errors) {
    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => !validate.isEmpty(valuePairs[1]))
      .filter(valuePairs => !validator.isEmail(valuePairs[1]))
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${generateIncorrectTypeErrMsg(
            values[0],
            'email'
          )}`;
        } else {
          errors[values[0]] = generateIncorrectTypeErrMsg(values[0], 'email');
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
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
  static phoneNumberValid(input, errors) {
    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => !validate.isEmpty(valuePairs[1]))
      .filter(valuePairs => !validator.isMobilePhone(valuePairs[1]))
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${generateIncorrectTypeErrMsg(
            values[0],
            'phone number'
          )}`;
        } else {
          errors[values[0]] = generateIncorrectTypeErrMsg(
            values[0],
            'phone number'
          );
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
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
  static minPasswordLength(input, errors) {
    const inputPairs = Object.entries(input);

    inputPairs
      .filter(valuePairs => !validate.isEmpty(valuePairs[1]))
      .filter(valuePairs => valuePairs[1].length <= 6)
      .forEach((values) => {
        if (Object.keys(errors).includes(values[0])) {
          errors[values[0]] += ` ,${values[0]}'s length should be 6 or above`;
        } else {
          errors[values[0]] = `${values[0]}'s length should be 6 or above`;
        }
      });

    return Object.keys(errors).length > 0 ? errors : null;
  }
}

export default Validation;
