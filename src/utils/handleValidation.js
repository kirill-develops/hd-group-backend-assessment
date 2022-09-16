export function handleValidation({
  formValues,
  setFormErrors
}) {
  const fields = formValues;
  const errors = {};
  let formIsValid = true;

  //Email
  if (!fields.email) {
    formIsValid = false;
    errors.email = 'cannot be empty';
  }

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
  if (!fields.photo) {
    formIsValid = false;
    errors.photo = 'cannot be empty';
  }

  if (fields.photo && fields.photo.size > 1024) {
    formIsValid = false;
    errors.photo = 'must be smaller than 1MB'
  }

  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;

  // Password
  if (!fields.password) {
    formIsValid = false;
    errors.password = 'cannot be empty';
  }

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

  // passwordConfirm
  if (fields.passwordConfirm !== fields.password) {
    formIsValid = false;
    errors.passwordConfirm = `doesn't match password above`
  }
  setFormErrors(errors);

  return formIsValid;
};