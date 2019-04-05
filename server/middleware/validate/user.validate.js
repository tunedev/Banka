import Validate from '../../helper-functions/validation';

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

export default validateSignup;
