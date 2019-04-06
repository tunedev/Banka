import Validate from '../../helper-functions/validation';
import Users from '../../models/user.model';

const validateSignup = (req, res, next) => {
  const {
    firstName, lastName, email, phoneNumber, password,
  } = req.body;

  const requiredNotGiven = Validate.requiredfieldIsGiven({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });

  if (requiredNotGiven) {
    return res.status(400).json({
      status: 400,
      error: requiredNotGiven,
    });
  }

  const isStringNotValid = Validate.stringType({
    firstName,
    lastName,
    password,
  });

  if (isStringNotValid) {
    return res.status(400).json({
      status: 400,
      error: isStringNotValid,
    });
  }

  const isEmailNotValid = Validate.emailType({ email });
  if (isEmailNotValid) {
    return res.status(400).json({
      status: 400,
      error: isEmailNotValid,
    });
  }

  const isPasswordSecure = Validate.minPasswordLength({ password });
  if (isPasswordSecure) {
    return res.status(400).json({
      status: 400,
      error: isPasswordSecure,
    });
  }

  const isPhoneNumberNotValid = Validate.phoneNumberValid({ phoneNumber });
  if (isPhoneNumberNotValid) {
    return res.status(400).json({
      status: 400,
      error: isPhoneNumberNotValid,
    });
  }

  if (!Validate.emailIsUnique(email)) {
    return res.status(400).json({
      status: 400,
      error: `Account with email: ${email} already exists`,
    });
  }

  next();
};

const validateSignin = (req, res, next) => {
  const { email, password } = req.body;

  const userDetails = Users.find(user => user.email === email);
  const requiredNotGiven = Validate.requiredfieldIsGiven({ email, password });

  if (requiredNotGiven) {
    return res.status(400).json({
      status: 400,
      error: requiredNotGiven,
    });
  }

  if (!userDetails) {
    return res.status(401).json({
      status: 401,
      error: 'Email or password is wrong',
    });
  }

  if (password !== userDetails.password) {
    return res.status(401).json({
      status: 401,
      error: 'Email or password is wrong',
    });
  }
  next();
};

export { validateSignup, validateSignin };
