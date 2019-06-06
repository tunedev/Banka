const setInvalid = (field, message) => {
  const helperText = field.nextElementSibling;
  field.classList.remove('valid');
  field.classList.add('invalid');
  helperText.innerHTML = message;
  helperText.style.display = 'block';
  helperText.style.color = 'tomato';
};

const setValid = field => {
  const helperText = field.nextElementSibling;
  field.classList.remove('invalid');
  field.classList.add('valid');
  helperText.innerHTML = '';
  helperText.style.display = 'none';
  helperText.style.color = '#4CAF50';
};

const isEmpty = field => {
  if (!field.value.trim()) {
    setInvalid(field, `${field.name} must not be empty`);
    return true;
  } else {
    setValid(field);
    return false;
  }
};

const isValidFullName = field => {
  const regExp = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (regExp.test(field.value.trim())) {
    setValid(field);
    return true;
  }
  setInvalid(
    field,
    `${field.name} must follow this format 'Firstname Lastname'
      and must contain only letters`
  );
  return false;
};

const meetSpecifiedLength = (field, minLength, maxLength) => {
  const { value } = field;
  if (value.length >= minLength && value.length < maxLength) {
    setValid(field);
    return true;
  } else if (value.length < minLength) {
    setInvalid(
      field,
      `${field.name} must be atleast ${minLength} characters long`
    );
    return false;
  } else {
    setInvalid(
      field,
      `${field.name} must not be shorter than ${maxLength} characters`
    );
  }
};

const matchNigeriaPhoneNUmber = field => {
  const regExp = /^[0][7-9][0-1]\d{8}$/;
  if (regExp.test(field.value.trim())) {
    setValid(field);
    return true;
  }
  setInvalid(field, `${field.name} must be a valid Nigerian phone number`);
  return false;
};

const isValidEmailAddress = field => {
  const regExp = /([a-zA-Z\d-_\.])@([a-zA-Z-]).([a-z]{2,8})(.[a-z]{2,8})/;
  if (regExp.test(field.value.toLowerCase())) {
    setValid(field);
    return true;
  }
  setInvalid(field, `${field.name} must be a valid mail format`);
  return false;
};
