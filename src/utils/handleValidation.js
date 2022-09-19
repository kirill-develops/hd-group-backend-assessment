function verifyNotEmpty({ fields, field, errors, formIsValid }) {
  if (!fields[field]) {
    formIsValid = false;
    errors[field] = 'cannot be empty';
  }
}


function verifyEmail({ fields, errors, formIsValid }) {
  verifyNotEmpty({ fields, field: 'email', errors, formIsValid })

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
}


function verifyPassword({ fields, errors, formIsValid }) {
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
  verifyNotEmpty({ fields, field: 'password', errors, formIsValid })

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
    verifyEmail({ fields, errors, formIsValid });
    verifyPassword({ fields, errors, formIsValid });
    setFormErrors(errors);
    return formIsValid;
  }


  // validate fields for User verification
  if (type === 'verify') {
    verifyEmail({ fields, errors, formIsValid });
    // check verification code field is not empty
    verifyNotEmpty({ fields, field: 'verification', errors, formIsValid })

    setFormErrors(errors);
    return formIsValid;
  }


  // validate fields for User Sign Up
  if (type === 'signUp') {
    verifyEmail({ fields, errors, formIsValid });
    verifyPassword({ fields, errors, formIsValid });

    // Photo
    verifyNotEmpty({ fields, field: 'photo', errors, formIsValid })
    if (fields.photo && fields.photo.size > 1024000) {
      formIsValid = false;
      errors.photo = `must be smaller than 1MB ${fields.photo.size}`
    }

    // passwordConfirm
    verifyNotEmpty({ fields, field: 'passwordConfirm', errors, formIsValid })
    if (fields.passwordConfirm !== fields.password) {
      formIsValid = false;
      errors.passwordConfirm = `doesn't match password above`
    }

    setFormErrors(errors);
    return formIsValid;
  }
};