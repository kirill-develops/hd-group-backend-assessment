function verifyNotEmpty({ fields, field, errors }) {
  if (!fields[field]) {
    errors[field] = 'cannot be empty';
    return false;
  } else {
    return true;
  }
}


function verifyEmail({ fields, errors }) {
  let formIsValid = verifyNotEmpty({ fields, field: 'email', errors });

  if (fields.email) {
    let lastAtPos = fields.email.lastIndexOf('@');
    let lastDotPos = fields.email.lastIndexOf('.');

    if (
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        fields.email.indexOf('@@') === -1 &&
        lastDotPos > 2 &&
        fields.email.length - lastDotPos > 2
      )
    ) {
      formIsValid = false;
      errors.email = 'is not valid';
    }
  }
  return formIsValid;
}


function verifyPassword({ fields, errors }) {
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
  let formIsValid = verifyNotEmpty({ fields, field: 'password', errors })

  if (fields.password) {
    if (!fields.password.match(passwordRules)) {
      formIsValid = false;
      errors.password = 'must contain atleast 1 number & 1 special character'
    }
    if (fields.password.length < 8) {
      formIsValid = false;
      errors.password = 'must be at least 8 characters'
    }
  }
  return formIsValid
}


export function handleValidation({
  formValues,
  setFormErrors,
  type = 'signUp'
}) {

  const fields = formValues;
  const errors = {};
  let formIsValid = true;


  // validate fields for User Sign In
  if (type === 'signIn') {
    formIsValid = verifyEmail({ fields, errors });
    formIsValid = verifyPassword({ fields, errors, formIsValid });

    setFormErrors(errors);
    return formIsValid;
  }


  // validate fields for User Sign Up
  if (type === 'signUp') {
    formIsValid = verifyEmail({ fields, errors });
    formIsValid = verifyPassword({ fields, errors });

    // Photo
    formIsValid = verifyNotEmpty({ fields, field: 'photo', errors })
    if (fields.photo && fields.photo.size > 1024000) {
      formIsValid = false;
      errors.photo = `must be smaller than 1MB ${fields.photo.size}`
    }

    // passwordConfirm
    formIsValid = verifyNotEmpty({ fields, field: 'passwordConfirm', errors })
    if (fields.passwordConfirm !== fields.password) {
      formIsValid = false;
      errors.passwordConfirm = `doesn't match password above`
    }

    setFormErrors(errors);
    return formIsValid;
  }


  // validate fields for User verification
  if (type === 'verify') {
    formIsValid = verifyEmail({ fields, errors });
    // check verification code field is not empty
    formIsValid = verifyNotEmpty({ fields, field: 'verification', errors })

    setFormErrors(errors);
    return formIsValid;
  }
};