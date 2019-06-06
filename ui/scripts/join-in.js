const fullName = document.getElementById('fullName');
const phoneNumber = document.getElementById('phoneNumber');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.getElementById('submit');

windows.addEventListener('onload', () => {
  submit.disable = true;
});

const validateFullName = () => {
  if (isEmpty(fullName)) return;
  if (!isValidFullName(fullName)) return;
  return true;
};

const validatePhoneNumber = () => {
  if (isEmpty(phoneNumber)) return;
  if (!matchNigeriaPhoneNUmber(phoneNumber)) return;
  return true;
};

const validateEmailAddress = () => {
  if (isEmpty(email)) return;
  if (!isValidEmailAddress(email)) return;
  return true;
};

const validatePassword = () => {
  if (isEmpty(password)) return;
  if (!meetSpecifiedLength(password, 6, 100)) return;
  return true;
};

fullName.addEventListener('focusout', validateFullName);
phoneNumber.addEventListener('focusout', validatePhoneNumber);
email.addEventListener('focusout', validateEmailAddress);
password.addEventListener('focusout', validatePassword);

submit.addEventListener('submit', e => {
  e.target.preventDefault();

  if (
    !validateFullName() &&
    !validateEmailAddress() &&
    !validatePhoneNumber() &&
    !validatePassword()
  ) {
    return;
  }

  e.target.disable = false;

  const [firstName, lastName] = fullName.value.split(' ');
});
