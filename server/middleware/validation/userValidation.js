import Validate from '../../helpers/validation';
import responseHandler from '../../helpers/response';
import users from '../../models/users';

const { error } = responseHandler;

class UserValidation {
  /**
   * @description Helps validate that the data passed in through the
   signp end point is as expected
   *
   * @static validateSignup
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns error message that guides for correct use of this endpoint
   * @memberof UserValidation
   */
  static async validateSignup(request, response, next) {
    const errors = {};
    const {
      firstName, lastName, email, phoneNumber, password
    } = request.body;

    Validate.requiredFieldIsGiven(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      },
      errors
    );

    Validate.stringType(
      {
        firstName,
        lastName,
        password
      },
      errors
    );

    Validate.textType({ firstName, lastName }, errors);

    Validate.emailType({ email }, errors);

    Validate.minPasswordLength({ password }, errors);

    const isPhoneNumberNotValid = Validate.phoneNumberValid(
      { phoneNumber },
      errors
    );
    if (isPhoneNumberNotValid) {
      return error(response, 400, isPhoneNumberNotValid);
    }

    const result = await users.getByEmail(email);

    if (result) {
      return error(response, 409, 'conflict user with email already exist');
    }

    next();
  }

  /**
   * @description validates that the expected
   data are passed to the signin route
   *
   * @static validateSignup
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns error messages to guide users in passing expected
   input to the signin endpoint
   * @memberof UserValidation
   */
  static validateSignin(request, response, next) {
    const { email, password } = request.body;
    const errors = {};

    Validate.requiredFieldIsGiven({ email, password }, errors);

    const isEmailNotValid = Validate.emailType({ email }, errors);
    if (isEmailNotValid) {
      return error(response, 400, isEmailNotValid);
    }

    next();
  }

  /**
   * @description Validates if specified user
    mail belongs to an existing user
   *
   * @static assertEmailExist
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @returns
   * @memberof UserValidation
   */
  static async assertEmailExist(request, response, next) {
    const email = request.params.userEmail;

    const result = await users.getByEmail(email);

    if (!result) {
      return error(
        response,
        404,
        'user with email already exist does not exist'
      );
    }

    request.body.id = result.id;
    next();
  }
}
export default UserValidation;
